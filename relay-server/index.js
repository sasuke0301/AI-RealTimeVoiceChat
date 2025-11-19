import { RealtimeRelay } from './lib/relay-enhanced.js';
import dotenv from 'dotenv';
dotenv.config({ override: true });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error(
    `Environment variable "OPENAI_API_KEY" is required.\n` +
      `Please set it in your .env file.`
  );
  process.exit(1);
}

const PORT = parseInt(process.env.PORT) || 8081;

console.log('[Server] Starting AI Teacher Relay Server...');
console.log('[Server] Firebase Admin SDK initialized');
console.log('[Server] OpenAI API configured');

const relay = new RealtimeRelay(OPENAI_API_KEY);
relay.listen(PORT);

console.log(`[Server] AI Teacher System ready on port ${PORT}`);
