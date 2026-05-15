# Easy Deploy Guide

## Step 1: Get Groq API Key (1 minute)
1. Open: https://console.groq.com/
2. Sign up (free, no credit card)
3. Go to "API Keys" → "Create API Key"
4. Copy the key (starts with `gsk_`)

## Step 2: Create .env file
```bash
echo "GROQ_API_KEY=gsk_paste_your_key_here" > .env
```

## Step 3: Test Locally (Optional)
```bash
npm install
npm run test-api
vercel dev
```

## Step 4: Deploy
```bash
# Install Vercel CLI (one time only)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add your API key
vercel env add GROQ_API_KEY
# Paste your gsk_ key
# Select: Production

# Redeploy with env var
vercel --prod
```

**You'll get a URL like:** https://your-project.vercel.app

---

## Troubleshooting

**"vercel command not found"**
```bash
npm i -g vercel
```

**"Need to login"**
```bash
vercel login
```

**"API key not working"**
- Make sure you added it: `vercel env add GROQ_API_KEY`
- Redeploy: `vercel --prod`
