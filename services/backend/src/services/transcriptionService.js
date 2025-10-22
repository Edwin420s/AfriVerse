const axios = require('axios');
const FormData = require('form-data');

/**
 * TranscriptionService
 *
 * Provides audio->text transcription using ASI:Cloud AI inference
 * (using hackathon $20 credits) with HuggingFace and OpenAI fallbacks.
 * Maps common language codes for African languages (sw, am, yo, ig, ha) and English.
 *
 * Env:
 * - ASI_CLOUD_API_KEY: API key for ASI:Cloud inference ($20 hackathon credits)
 * - OPENAI_API_KEY: Fallback API key for OpenAI Whisper
 * - HUGGINGFACE_TOKEN: Token for HuggingFace Inference API
 */
class TranscriptionService {
  constructor() {
    // Priority 1: ASI:Cloud (Hackathon credits)
    this.asiCloudKey = process.env.ASI_CLOUD_API_KEY;
    this.asiCloudEndpoint = process.env.ASI_CLOUD_ENDPOINT || 'https://cloud.fetch.ai/v1/inference';
    
    // Fallbacks
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.huggingfaceToken = process.env.HUGGINGFACE_TOKEN;
  }

  /**
   * Transcribe an audio buffer to text.
   * Priority: ASI:Cloud ($20 credits) → OpenAI → HuggingFace
   * @param {Buffer} buffer - Audio bytes (wav recommended)
   * @param {string} [language='sw'] - ISO-ish language code
   * @returns {Promise<{text:string, language:string, duration:number|null, words:any[], provider:string}>}
   */
  async transcribeAudio(buffer, language = 'sw') {
    // Try ASI:Cloud first (hackathon credits)
    if (this.asiCloudKey) {
      try {
        return await this.transcribeWithASICloud(buffer, language);
      } catch (error) {
        console.error('ASI:Cloud transcription failed:', error.message);
      }
    }

    // Fallback to OpenAI
    if (this.openaiKey) {
      try {
        return await this.transcribeWithOpenAI(buffer, language);
      } catch (error) {
        console.error('OpenAI transcription failed:', error.message);
      }
    }
    
    // Final fallback to HuggingFace
    return await this.transcribeWithHuggingFace(buffer, language);
  }

  /**
   * Transcribe using ASI:Cloud inference API (Hackathon $20 credits)
   * @param {Buffer} buffer - Audio bytes
   * @param {string} language - Language code
   * @returns {Promise<{text:string, language:string, duration:number|null, words:any[], provider:string}>}
   */
  async transcribeWithASICloud(buffer, language) {
    const formData = new FormData();
    formData.append('file', buffer, {
      filename: 'audio.wav',
      contentType: 'audio/wav'
    });
    formData.append('model', 'whisper-1');
    formData.append('language', this.mapLanguageCode(language));

    const response = await axios.post(
      `${this.asiCloudEndpoint}/whisper/transcriptions`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${this.asiCloudKey}`,
          ...formData.getHeaders()
        },
        timeout: 60000
      }
    );

    return {
      text: response.data.text,
      language: response.data.language || language,
      duration: response.data.duration || null,
      words: response.data.words || [],
      provider: 'ASI:Cloud'
    };
  }

  /**
   * Transcribe using OpenAI Whisper API (fallback)
   * @param {Buffer} buffer - Audio bytes
   * @param {string} language - Language code
   * @returns {Promise<{text:string, language:string, duration:number|null, words:any[], provider:string}>}
   */
  async transcribeWithOpenAI(buffer, language) {
    const { OpenAI } = require('openai');
    const openai = new OpenAI({ apiKey: this.openaiKey });

    const formData = new FormData();
    formData.append('file', buffer, 'audio.wav');

    const transcription = await openai.audio.transcriptions.create({
      file: buffer,
      model: "whisper-1",
      language: this.mapLanguageCode(language),
      response_format: "verbose_json"
    });

    return {
      text: transcription.text,
      language: transcription.language,
      duration: transcription.duration,
      words: transcription.words || [],
      provider: 'OpenAI'
    };
  }

  /**
   * HuggingFace fallback transcription using wav2vec2 model.
   * @param {Buffer} buffer
   * @param {string} language
   * @returns {Promise<{text:string, language:string, duration:null, words:any[], provider:string}>}
   */
  async transcribeWithHuggingFace(buffer, language) {
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/wav2vec2-large-xlsr-53',
        buffer,
        {
          headers: {
            'Authorization': `Bearer ${this.huggingfaceToken}`,
            'Content-Type': 'application/octet-stream'
          }
        }
      );

      return {
        text: response.data.text,
        language: language,
        duration: null,
        words: [],
        provider: 'HuggingFace'
      };
    } catch (error) {
      throw new Error(`All transcription providers failed: ${error.message}`);
    }
  }

  /**
   * Map short language codes to model-supported codes.
   * @param {string} code
   * @returns {string}
   */
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