# How Cooked Are You? 🔥

AI-powered academic survival detector with brutal honesty and Gen-Z humor.

## Quick Setup

1. **Get FREE Groq API Key**: https://console.groq.com/ (no credit card)
2. **Create `.env` file**:
   ```bash
   echo "GROQ_API_KEY=gsk_your_key_here" > .env
   ```
3. **Test locally**:
   ```bash
   npm install
   npm run test-api  # Verify API key works
   vercel dev        # Run at localhost:3000
   ```
4. **Deploy**:
   ```bash
   vercel
   # Add GROQ_API_KEY in Vercel dashboard → Settings → Environment Variables
   ```

## Tech Stack

- React + Vite
- Groq AI (Llama 3.3 70B) - FREE tier: 14,400 req/day
- Serverless backend (Vercel/Netlify)
- Custom CSS with particle animations

## Project Structure

```
├── how-cooked-are-you.jsx  # Main React app
├── api/analyze.js          # Secure backend API
├── test-groq.js            # API key tester
├── .env                    # Your API key (create this)
└── .env.example            # Template
```

## Security

- API key stored in environment variables (never in frontend)
- Backend endpoint handles all AI requests
- `.env` file is gitignored

---

**Groq API**: https://console.groq.com/  
**Docs**: https://console.groq.com/docs
