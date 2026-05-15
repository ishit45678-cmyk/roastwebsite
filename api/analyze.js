// Serverless function to handle AI analysis using Groq
// Works with Vercel, Netlify, and similar platforms

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers for frontend access
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { form, localResults } = req.body;

    // Validate input
    if (!form || !localResults) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    const prompt = `You are a brutally honest, hilarious Gen-Z academic survival analyst AI called "CookedAI". 
A student submitted their academic stats:
- Sleep: ${form.sleep} hours/night
- Attendance: ${form.attendance}%
- GPA/CGPA: ${form.gpa}/10
- Assignment completion: ${form.assignments}%
- All-nighters/week: ${form.allnighters}
- Daily screen time: ${form.screentime} hrs
- Their biggest academic mistake: "${form.mistake || "didn't share, too ashamed"}"

Their computed stats:
- Cooked Percentage: ${localResults.cookedPct}%
- Survival Probability: ${localResults.survivalPct}%
- Mental Stability: ${localResults.stabilityPct}%
- Academic Aura Score: ${localResults.auraPct}%

Respond ONLY with a valid JSON object (no markdown, no backticks) with these exact keys:
{
  "roast": "A savage, funny 2-sentence roast of their academic situation",
  "comeback": "A genuinely motivating but still funny 1-sentence comeback message",
  "diagnosis": "A 4-6 word meme-style diagnosis (e.g. 'Advanced Stage Procrastination with GPA Complications')",
  "outcome": "A 1-sentence dramatic semester outcome prediction",
  "recoveryPlan": ["3-4 brutally practical recovery tips as short strings, max 12 words each"]
}`;

    // Call Groq API with your API key from environment variable
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Fast and free!
        messages: [
          {
            role: "system",
            content: "You are CookedAI, a brutally honest Gen-Z academic analyst. Always respond with valid JSON only, no markdown."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || "";
    const ai = JSON.parse(text);

    // Return the AI response
    return res.status(200).json({
      success: true,
      data: { ...localResults, ...ai }
    });

  } catch (error) {
    console.error("Error in analyze function:", error);
    
    // Return fallback response
    return res.status(200).json({
      success: true,
      data: {
        ...req.body.localResults,
        roast: "Your academic situation is so bad, even the AI refused to look at it. That says everything.",
        comeback: "You made it this far — which is technically an achievement nobody expected.",
        diagnosis: "Critical Academic Entropy with Hopium Overload",
        outcome: "Semester outcome: TBD, but the vibes are not immaculate.",
        recoveryPlan: [
          "Sleep before 2 AM at least once this week",
          "Open at least one assignment before the deadline",
          "Attend class — any class",
          "Hydrate. Seriously."
        ],
      }
    });
  }
}
