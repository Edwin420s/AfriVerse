# ASI:Cloud Integration Guide

## Overview

AfriVerse uses **ASI:Cloud AI inference** as the primary transcription provider, utilizing the **$20 hackathon credits** provided by the BGI25 Hackathon organizers.

---

## 🎟️ Claiming Your $20 Credits

### Step 1: Get Your API Key

1. Visit the hackathon credits page: **[Claim Your Credits](https://cloud.fetch.ai/hackathon)**
2. Sign up or log in with your hackathon participant email
3. Your API key will be displayed on the dashboard
4. Copy your API key (format: `asi_xxxxxxxxxxxxx`)

### Step 2: Configure Environment

Add your API key to the backend `.env` file:

```bash
# Navigate to backend directory
cd services/backend

# Copy example env file if not exists
cp .env.example .env

# Edit .env and add your key
ASI_CLOUD_API_KEY=asi_your_actual_key_here
ASI_CLOUD_ENDPOINT=https://cloud.fetch.ai/v1/inference
```

---

## 🔧 How It Works

### Transcription Priority Order

AfriVerse uses a **waterfall approach** for transcription:

```
1. ASI:Cloud ($20 credits)  ←  PRIMARY (Hackathon requirement)
   ↓ (fallback on error)
2. OpenAI Whisper           ←  FALLBACK 1
   ↓ (fallback on error)
3. HuggingFace wav2vec2     ←  FALLBACK 2 (last resort)
```

### Code Implementation

**File:** `services/backend/src/services/transcriptionService.js`

```javascript
class TranscriptionService {
  async transcribeAudio(buffer, language = 'sw') {
    // Try ASI:Cloud first (hackathon credits)
    if (this.asiCloudKey) {
      try {
        return await this.transcribeWithASICloud(buffer, language);
      } catch (error) {
        console.error('ASI:Cloud failed:', error.message);
      }
    }

    // Fallback to OpenAI
    if (this.openaiKey) {
      try {
        return await this.transcribeWithOpenAI(buffer, language);
      } catch (error) {
        console.error('OpenAI failed:', error.message);
      }
    }
    
    // Final fallback to HuggingFace
    return await this.transcribeWithHuggingFace(buffer, language);
  }
}
```

---

## 📊 Tracking Credit Usage

### Check Remaining Credits

```bash
# Make a test request
curl -X GET https://cloud.fetch.ai/v1/account/credits \
  -H "Authorization: Bearer ${ASI_CLOUD_API_KEY}"
```

**Response:**
```json
{
  "total_credits": 20.00,
  "used_credits": 0.45,
  "remaining_credits": 19.55,
  "credit_currency": "USD"
}
```

### Monitor Usage in Application

The transcription service returns which provider was used:

```javascript
const result = await transcriptionService.transcribeAudio(audioBuffer, 'sw');

console.log(result);
// {
//   text: "Aloe vera inatumika kutibu maumivu...",
//   language: "sw",
//   duration: 12.5,
//   words: [...],
//   provider: "ASI:Cloud"  ← Shows which provider was used
// }
```

---

## 🧪 Testing ASI:Cloud Integration

### 1. Unit Test

Create `services/backend/tests/transcription.test.js`:

```javascript
const TranscriptionService = require('../src/services/transcriptionService');
const fs = require('fs');

test('ASI:Cloud transcription works', async () => {
  const service = new TranscriptionService();
  const audioBuffer = fs.readFileSync('./test-audio.wav');
  
  const result = await service.transcribeAudio(audioBuffer, 'sw');
  
  expect(result.provider).toBe('ASI:Cloud');
  expect(result.text).toBeTruthy();
  expect(result.language).toBe('sw');
});
```

### 2. Manual Test via API

```bash
# Start backend
cd services/backend
npm run dev

# Test transcription endpoint
curl -X POST http://localhost:4000/api/transcribe \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test-audio.wav" \
  -F "language=sw"
```

**Expected Response:**
```json
{
  "success": true,
  "transcript": "Aloe vera inatumika kutibu...",
  "language": "sw",
  "duration": 12.5,
  "provider": "ASI:Cloud",
  "credits_used": 0.15
}
```

---

## 💰 Cost Estimation

### ASI:Cloud Pricing (using $20 credits)

| Operation | Cost per Request | $20 Credit Capacity |
|-----------|------------------|---------------------|
| Whisper Transcription (1 min) | ~$0.10 | ~200 entries |
| Whisper Transcription (5 min) | ~$0.50 | ~40 entries |
| LLM Symbolization (per entry) | ~$0.05 | ~400 entries |

**Total AfriVerse Entry (audio + symbolization):**
- 1-minute audio: ~$0.15 per entry → **~133 entries with $20**
- 5-minute audio: ~$0.55 per entry → **~36 entries with $20**

---

## 🔐 Security Best Practices

### ✅ DO:
- Store API key in `.env` file (gitignored)
- Use environment variables only
- Rotate keys after hackathon if needed
- Monitor usage regularly

### ❌ DON'T:
- Hardcode API key in code
- Commit `.env` file to Git
- Share API key publicly
- Expose key in frontend code

---

## 🐛 Troubleshooting

### Error: "ASI:Cloud API key not found"

**Solution:**
```bash
# Verify .env file exists
ls services/backend/.env

# Check key is set
grep ASI_CLOUD_API_KEY services/backend/.env

# Restart backend
cd services/backend
npm run dev
```

### Error: "Rate limit exceeded"

**Solution:**
You've used your $20 credits. Fallback providers (OpenAI/HuggingFace) will be used automatically.

### Error: "Invalid API key"

**Solution:**
1. Re-check your key from the [credits dashboard](https://cloud.fetch.ai/hackathon)
2. Ensure no extra spaces or quotes in `.env`
3. Restart the backend service

---

## 📖 Additional Resources

- **ASI Alliance Docs:** https://docs.asi1.ai/documentation/getting-started/overview
- **Fetch.AI Cloud:** https://cloud.fetch.ai
- **Hackathon Credits:** https://cloud.fetch.ai/hackathon
- **Support:** BGI25 WhatsApp Community

---

## ✅ Verification Checklist

Before submitting to hackathon judges:

- [ ] ASI_CLOUD_API_KEY added to `.env`
- [ ] Test transcription returns `provider: "ASI:Cloud"`
- [ ] Credits dashboard shows usage > 0
- [ ] Fallback to OpenAI/HuggingFace works if ASI:Cloud fails
- [ ] README documents ASI:Cloud integration
- [ ] Demo video shows ASI:Cloud in action

---

**Last Updated:** October 22, 2025  
**Integration Status:** ✅ **COMPLETE**  
**Compliance:** Meets BGI25 Hackathon requirements
