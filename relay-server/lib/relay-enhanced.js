import { WebSocketServer } from 'ws';
import { RealtimeClient } from '@openai/realtime-api-beta';
import { checkUsageLimit } from '../middleware/usageLimit.js';
import { buildContextFromRAG } from '../services/ragService.js';
import { findRelevantExperimentUrl } from '../services/urlService.js';
import { logConversation } from '../services/logger.js';
import { db } from '../firebase-admin.js';

export class RealtimeRelay {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.sockets = new WeakMap();
    this.wss = null;
    this.conversationData = new WeakMap(); // Store conversation data per connection
  }

  listen(port) {
    this.wss = new WebSocketServer({ port });
    this.wss.on('connection', this.connectionHandler.bind(this));
    this.log(`Listening on ws://localhost:${port}`);
  }

  async connectionHandler(ws, req) {
    if (!req.url) {
      this.log('No URL provided, closing connection.');
      ws.close();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const userId = url.searchParams.get('userId');

    if (pathname !== '/') {
      this.log(`Invalid pathname: "${pathname}"`);
      ws.close();
      return;
    }

    if (!userId) {
      this.log('No userId provided, closing connection.');
      ws.send(JSON.stringify({
        type: 'error',
        error: { message: 'User authentication required' }
      }));
      ws.close();
      return;
    }

    this.log(`Connection from user: ${userId}`);

    // Initialize conversation data for this connection
    this.conversationData.set(ws, {
      userId,
      currentQuestion: '',
      currentAnswer: '',
      startTime: Date.now()
    });

    // Check usage limit before allowing connection
    try {
      const usageCheck = await checkUsageLimit(userId);
      this.log(`User ${userId} has ${usageCheck.remaining} uses remaining`);
    } catch (error) {
      this.log(`Usage limit exceeded for user ${userId}: ${error.message}`);
      ws.send(JSON.stringify({
        type: 'error',
        error: { message: error.message }
      }));
      ws.close();
      return;
    }

    // Get user's course level and load appropriate prompt
    let userInstructions = '';
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      const courseLevel = userData?.courseLevel || 'preschool';

      const promptDoc = await db.collection('prompts')
        .where('courseLevel', '==', courseLevel)
        .limit(1)
        .get();

      if (!promptDoc.empty) {
        userInstructions = promptDoc.docs[0].data().instructions || '';
        this.log(`Loaded instructions for course level: ${courseLevel}`);
      }
    } catch (error) {
      this.log(`Error loading user instructions: ${error.message}`);
    }

    // Instantiate new client
    this.log(`Connecting with key "${this.apiKey.slice(0, 3)}..."`);
    const client = new RealtimeClient({ apiKey: this.apiKey });

    // Set user-specific instructions if available
    if (userInstructions) {
      client.updateSession({ instructions: userInstructions });
    }

    // Relay: OpenAI Realtime API Event -> Browser Event
    client.realtime.on('server.*', (event) => {
      this.log(`Relaying "${event.type}" to Client`);
      
      // Capture transcripts for logging
      const convData = this.conversationData.get(ws);
      if (convData) {
        if (event.type === 'response.audio_transcript.done' && event.transcript) {
          convData.currentAnswer = event.transcript;
        }
      }
      
      ws.send(JSON.stringify(event));
    });
    
    client.realtime.on('close', () => ws.close());

    // Relay: Browser Event -> OpenAI Realtime API Event
    const messageQueue = [];
    const messageHandler = async (data) => {
      try {
        const event = JSON.parse(data);
        this.log(`Relaying "${event.type}" to OpenAI`);
        
        // Handle different event types
        await this.handleClientEvent(event, client, ws, userId);
        
      } catch (e) {
        console.error(e.message);
        this.log(`Error parsing event from client: ${data}`);
      }
    };
    
    ws.on('message', (data) => {
      if (!client.isConnected()) {
        messageQueue.push(data);
      } else {
        messageHandler(data);
      }
    });
    
    ws.on('close', () => {
      this.log(`Connection closed for user ${userId}`);
      client.disconnect();
    });

    // Connect to OpenAI Realtime API
    try {
      this.log(`Connecting to OpenAI...`);
      await client.connect();
    } catch (e) {
      this.log(`Error connecting to OpenAI: ${e.message}`);
      ws.close();
      return;
    }
    
    this.log(`Connected to OpenAI successfully!`);
    
    while (messageQueue.length) {
      await messageHandler(messageQueue.shift());
    }
  }

  async handleClientEvent(event, client, ws, userId) {
    const convData = this.conversationData.get(ws);
    
    // Handle conversation item creation (user speaking)
    if (event.type === 'conversation.item.create') {
      if (event.item?.content?.[0]?.type === 'input_audio') {
        this.log(`User ${userId} is sending audio`);
      }
    }

    // Handle input audio transcription delta (capturing user's question)
    if (event.type === 'conversation.item.input_audio_transcription.completed') {
      if (event.transcript && convData) {
        convData.currentQuestion = event.transcript;
        this.log(`User question captured: ${event.transcript}`);
        
        // Build RAG context
        try {
          const ragContext = await buildContextFromRAG(event.transcript);
          if (ragContext) {
            this.log(`RAG context added to prompt`);
            // Get current instructions and append RAG context
            const userDoc = await db.collection('users').doc(userId).get();
            const userData = userDoc.data();
            const courseLevel = userData?.courseLevel || 'preschool';
            
            const promptDoc = await db.collection('prompts')
              .where('courseLevel', '==', courseLevel)
              .limit(1)
              .get();
            
            if (!promptDoc.empty) {
              const baseInstructions = promptDoc.docs[0].data().instructions || '';
              const enhancedInstructions = baseInstructions + ragContext;
              client.updateSession({ instructions: enhancedInstructions });
            }
          }
        } catch (error) {
          this.log(`Error building RAG context: ${error.message}`);
        }
      }
    }

    // Handle response completion (AI finished speaking)
    if (event.type === 'response.done') {
      if (convData && convData.currentQuestion && convData.currentAnswer) {
        // Find relevant experiment URL
        try {
          const urlToAppend = await findRelevantExperimentUrl(convData.currentQuestion);
          
          if (urlToAppend) {
            this.log(`Appending URL to response`);
            // Send additional text response with URL
            ws.send(JSON.stringify({
              type: 'response.text.delta',
              delta: urlToAppend
            }));
          }
        } catch (error) {
          this.log(`Error finding URL: ${error.message}`);
        }

        // Log conversation
        try {
          await logConversation(
            userId,
            convData.currentQuestion,
            convData.currentAnswer,
            0, // Audio length - could be calculated if needed
            {
              responseTime: Date.now() - convData.startTime,
              timestamp: new Date().toISOString()
            }
          );
          this.log(`Conversation logged for user ${userId}`);
        } catch (error) {
          this.log(`Error logging conversation: ${error.message}`);
        }

        // Reset for next conversation
        convData.currentQuestion = '';
        convData.currentAnswer = '';
        convData.startTime = Date.now();
      }
    }

    // Forward all events to OpenAI
    client.realtime.send(event.type, event);
  }

  log(...args) {
    console.log(`[RealtimeRelay]`, ...args);
  }
}

