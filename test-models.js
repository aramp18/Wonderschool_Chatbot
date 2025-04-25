import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function listModels() {
  try {
    console.log('Fetching available models...');
    const models = await openai.models.list();
    console.log('\nAvailable models:');
    models.data.forEach(model => {
      console.log(`- ${model.id}`);
    });
  } catch (error) {
    console.error('\nError:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

listModels(); 