// Script to import sample RAG content for AI Teacher System
// Run with: node scripts/importRAGContent.js

import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

// Initialize Firebase Admin
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  console.error('❌ FIREBASE_SERVICE_ACCOUNT_KEY not found in .env file');
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = admin.firestore();

// Sample RAG content
const ragContentSamples = [
  {
    contentId: 'safety001',
    title: '実験の安全ルール',
    content: '実験を始める前に、必ず大人の人と一緒に行いましょう。目を保護するためにゴーグルをつけ、手を洗ってから始めます。熱いものや危ない薬品には触らないでください。終わったら、使った道具をきれいに洗いましょう。',
    category: 'safety',
    keywords: ['安全', 'ルール', '準備', '注意'],
    targetAge: 'all'
  },
  {
    contentId: 'exp001',
    title: '色水を混ぜる実験',
    content: '透明なコップに水を入れます。食紅で赤、青、黄色の色水を作ります。違う色を混ぜると新しい色ができます。赤と青を混ぜると紫色になります。青と黄色を混ぜると緑色になります。赤と黄色を混ぜるとオレンジ色になります。',
    category: 'experiment',
    keywords: ['色', '水', '混ぜる', '実験', '食紅'],
    targetAge: 'preschool'
  },
  {
    contentId: 'exp002',
    title: '氷の実験',
    content: '水は0度以下になると凍って氷になります。冷凍庫に水を入れたコップを入れておくと、数時間後に氷ができます。氷は水よりも軽いので、水に浮きます。氷を温かい場所に置くと、また水に戻ります。',
    category: 'experiment',
    keywords: ['氷', '水', '凍る', '温度', '状態変化'],
    targetAge: 'preschool'
  },
  {
    contentId: 'art001',
    title: '折り紙で作る動物',
    content: '正方形の折り紙を用意します。対角線に沿って三角に折ります。もう一度三角に折ります。角を内側に折り込むと、うさぎの耳のような形になります。目や鼻を描いて完成です。',
    category: 'art',
    keywords: ['折り紙', '動物', 'うさぎ', '工作'],
    targetAge: 'preschool'
  },
  {
    contentId: 'science001',
    title: '空はなぜ青いの',
    content: '太陽の光には、いろいろな色が混ざっています。その光が空気にぶつかると、青い色だけがたくさん散らばります。だから、空は青く見えるのです。夕方になると、太陽の光が遠くから届くので、赤い色が見えやすくなります。',
    category: 'science',
    keywords: ['空', '青', '太陽', '光', '散乱'],
    targetAge: 'grade1'
  },
  {
    contentId: 'science002',
    title: '磁石のひみつ',
    content: '磁石には、N極とS極があります。違う極同士（NとS）は引き合い、同じ極同士（NとN、SとS）は反発します。磁石は、鉄やニッケルなどの金属をくっつけることができます。',
    category: 'science',
    keywords: ['磁石', 'N極', 'S極', '引力', '反発'],
    targetAge: 'grade3'
  },
  {
    contentId: 'plant001',
    title: '植物の育ち方',
    content: '植物は、種から芽が出て、葉が育ち、花が咲いて、また種ができます。育つためには、水、光、空気、温かさが必要です。葉は太陽の光を使って、植物の栄養を作ります。',
    category: 'nature',
    keywords: ['植物', '育つ', '種', '芽', '葉', '花'],
    targetAge: 'grade1'
  }
];

// Sample experiments with URLs
const experimentSamples = [
  {
    experimentId: 'exp001',
    title: '色水実験',
    description: '色を混ぜて新しい色を作る実験',
    url: 'https://example.com/experiments/color-mixing',
    category: '実験',
    keywords: ['色', '水', '混ぜる', '食紅']
  },
  {
    experimentId: 'exp002',
    title: '氷と水の実験',
    description: '水が氷になる様子を観察する実験',
    url: 'https://example.com/experiments/ice-water',
    category: '実験',
    keywords: ['氷', '水', '凍る', '溶ける']
  },
  {
    experimentId: 'art001',
    title: '折り紙動物園',
    description: '折り紙でいろいろな動物を作ろう',
    url: 'https://example.com/art/origami-animals',
    category: 'アート',
    keywords: ['折り紙', '動物', 'うさぎ', '鳥']
  }
];

// Sample prompts for different course levels
const promptSamples = [
  {
    courseLevel: 'preschool',
    instructions: `あなたは優しいAI先生です。5-6歳の子どもたちに、実験やアート活動を教えます。

話し方：
- とても簡単な言葉を使ってください
- 短い文で話します（1-2文ずつ）
- 「すごいね！」「面白いね！」という言葉をたくさん使います
- 必ず「先生」と自分のことを呼びます

例：
「すごい質問だね！空が青いのは、太陽の光が空気にぶつかるからだよ。きれいだよね！」`,
    difficultyDescription: '年長向け - 非常に簡単な言葉、短い文'
  },
  {
    courseLevel: 'grade1',
    instructions: `あなたは優しいAI先生です。小学1年生の子どもたちに、実験やアート活動を教えます。

話し方：
- 簡単な言葉を使いますが、少し説明を加えます
- 2-3文で話します
- 驚きや共感を示します
- 「先生」と自分のことを呼びます

例：
「いい質問だね！空が青く見えるのは、太陽の光が空気とぶつかって、青い光だけが散らばるからなんだ。科学って面白いね！」`,
    difficultyDescription: '小学1年生向け - 簡単な言葉、やや詳しい説明'
  },
  {
    courseLevel: 'grade3',
    instructions: `あなたは優しいAI先生です。小学3年生の子どもたちに、実験やアート活動を教えます。

話し方：
- 分かりやすい言葉で、少し科学的な説明もします
- 3-4文で話します
- 「なぜだと思う？」と考えさせる質問もします
- 「先生」と自分のことを呼びます

例：
「素晴らしい質問だね！空が青いのは、レイリー散乱という現象が原因だよ。太陽の光には色々な色が含まれていて、青い光は散らばりやすいんだ。だから空が青く見えるんだよ。」`,
    difficultyDescription: '小学3年生向け - やや科学的な言葉、詳しい説明'
  }
];

async function importRAGContent() {
  console.log('📚 Importing RAG content...\n');
  
  for (const content of ragContentSamples) {
    try {
      await db.collection('ragContent').add({
        ...content,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ Added RAG content: ${content.title}`);
    } catch (error) {
      console.error(`❌ Error adding ${content.title}:`, error.message);
    }
  }
}

async function importExperiments() {
  console.log('\n🧪 Importing experiments...\n');
  
  for (const experiment of experimentSamples) {
    try {
      await db.collection('experiments').add({
        ...experiment,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ Added experiment: ${experiment.title}`);
    } catch (error) {
      console.error(`❌ Error adding ${experiment.title}:`, error.message);
    }
  }
}

async function importPrompts() {
  console.log('\n📝 Importing course level prompts...\n');
  
  for (const prompt of promptSamples) {
    try {
      await db.collection('prompts').add({
        ...prompt,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ Added prompt for: ${prompt.courseLevel}`);
    } catch (error) {
      console.error(`❌ Error adding prompt for ${prompt.courseLevel}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting data import for AI Teacher System...\n');
  
  await importRAGContent();
  await importExperiments();
  await importPrompts();
  
  console.log('\n✅ All data imported successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - RAG Content: ${ragContentSamples.length} items`);
  console.log(`   - Experiments: ${experimentSamples.length} items`);
  console.log(`   - Prompts: ${promptSamples.length} course levels`);
  
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

