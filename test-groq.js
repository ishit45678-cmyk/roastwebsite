// Simple test script to verify your Groq API key works
// Run with: node test-groq.js

import 'dotenv/config';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error('❌ Error: GROQ_API_KEY not found in .env file');
  console.log('\n📝 Create a .env file with:');
  console.log('GROQ_API_KEY=gsk_your_key_here\n');
  process.exit(1);
}

console.log('🔑 API Key found:', GROQ_API_KEY.substring(0, 10) + '...');
console.log('🧪 Testing Groq API...\n');

const testPrompt = {
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "system",
      content: "You are CookedAI, a brutally honest Gen-Z academic analyst. Always respond with valid JSON only."
    },
    {
      role: "user",
      content: `Generate a test response in JSON format with these keys:
{
  "roast": "A funny 1-sentence roast",
  "comeback": "A motivating comeback",
  "diagnosis": "A 4-word diagnosis",
  "outcome": "A 1-sentence prediction",
  "recoveryPlan": ["tip 1", "tip 2", "tip 3"]
}`
    }
  ],
  temperature: 0.8,
  max_tokens: 500,
  response_format: { type: "json_object" }
};

async function testGroq() {
  try {
    const startTime = Date.now();
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(testPrompt)
    });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API Error:', error);
      
      if (response.status === 401) {
        console.log('\n💡 Your API key is invalid. Get a new one at:');
        console.log('https://console.groq.com/keys\n');
      }
      
      process.exit(1);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.error('❌ No content in response');
      console.log('Response:', JSON.stringify(data, null, 2));
      process.exit(1);
    }

    const parsed = JSON.parse(content);
    
    console.log('✅ Success! Groq API is working!\n');
    console.log('⚡ Response time:', duration + 's');
    console.log('📊 Tokens used:', data.usage?.total_tokens || 'N/A');
    console.log('\n📝 Sample Response:');
    console.log('─────────────────────────────────────');
    console.log('Roast:', parsed.roast);
    console.log('Comeback:', parsed.comeback);
    console.log('Diagnosis:', parsed.diagnosis);
    console.log('Outcome:', parsed.outcome);
    console.log('Recovery Plan:');
    parsed.recoveryPlan?.forEach((tip, i) => {
      console.log(`  ${i + 1}. ${tip}`);
    });
    console.log('─────────────────────────────────────\n');
    
    console.log('🎉 Your app is ready to deploy!');
    console.log('\n📚 Next steps:');
    console.log('1. Run: vercel dev (for local testing)');
    console.log('2. Or: vercel (to deploy)');
    console.log('3. Add GROQ_API_KEY to your deployment platform\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Make sure you have internet connection');
    }
    
    process.exit(1);
  }
}

testGroq();
