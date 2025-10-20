const axios = require('axios');
const { OpenAI } = require('openai');

class TranscriptionService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async transcribeAudio(buffer, language = 'sw') {
    try {
      // For MVP, using OpenAI Whisper
      const transcription = await this.openai.audio.transcriptions.create({
        file: buffer,
        model: "whisper-1",
        language: this.mapLanguageCode(language),
        response_format: "verbose_json"
      });

      return {
        text: transcription.text,
        language: transcription.language,
        duration: transcription.duration,
        words: transcription.words || []
      };
    } catch (error) {
      console.error('Transcription Error:', error);
      
      // Fallback to Hugging Face if available
      return await this.transcribeWithHuggingFace(buffer, language);
    }
  }

  async transcribeWithHuggingFace(buffer, language) {
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/wav2vec2-large-xlsr-53',
        buffer,
        {
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
            'Content-Type': 'application/octet-stream'
          }
        }
      );

      return {
        text: response.data.text,
        language: language,
        duration: null,
        words: []
      };
    } catch (error) {
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  mapLanguageCode(code) {
    const languageMap = {
      'sw': 'sw',    // Swahili
      'am': 'am',    // Amharic  
      'yo': 'yo',    // Yoruba
      'ig': 'ig',    // Igbo
      'ha': 'ha',    // Hausa
      'en': 'en'     // English
    };
    return languageMap[code] || 'en';
  }
}

module.exports = new TranscriptionService();