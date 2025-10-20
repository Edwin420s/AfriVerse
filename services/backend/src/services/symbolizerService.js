const { OpenAI } = require('openai');

/**
 * SymbolizerService
 *
 * Uses an LLM to convert natural language transcripts into MeTTa-style atoms
 * for symbolic knowledge representation. Falls back to simple heuristic
 * extraction when the LLM is unavailable.
 *
 * Env:
 * - OPENAI_API_KEY: API key for OpenAI
 */
class SymbolizerService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Extract MeTTa atoms from a transcript using an LLM.
   * @param {string} transcript - Natural language transcript content.
   * @param {object} context - Optional contextual metadata.
   * @returns {Promise<{atoms:string[], rawResponse:string, atomCount:number}>}
   */
  async extractAtoms(transcript, context = {}) {
    const prompt = this.createSymbolizerPrompt(transcript, context);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a cultural knowledge extraction expert. Convert oral transcripts about African indigenous knowledge into structured symbolic atoms following MeTTa format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      });

      const response = completion.choices[0].message.content;
      return this.parseSymbolizerResponse(response);
    } catch (error) {
      console.error('Symbolizer Error:', error);
      return this.fallbackSymbolizer(transcript);
    }
  }

  /**
   * Construct the prompt used to instruct the LLM to output valid MeTTa atoms.
   * @param {string} transcript
   * @param {object} context
   * @returns {string}
   */
  createSymbolizerPrompt(transcript, context) {
    return `
TRANSCRIPT: "${transcript}"

CONTEXT: ${JSON.stringify(context)}

Convert this transcript into structured symbolic atoms. Focus on:

1. ENTITIES: Identify plants, people, practices, places, rituals
2. PROPERTIES: Describe characteristics, uses, contexts
3. RELATIONS: Show relationships between entities
4. PROVENANCE: Include source information

Output format must be valid MeTTa atoms in this exact structure:

(plant "aloe_vera")
(has_local_name "aloe_vera" "mwarubaini")
(property "aloe_vera" "soothing")
(treats "aloe_vera" "burn")
(found_in "aloe_vera" "eastern_kenya")
(provenance "entry_123" "signedBy" "0xABC" "timestamp" "2025-10-15")

Return ONLY the MeTTa atoms, no explanations.
`;
  }

  /**
   * Parse the LLM response into a list of valid atom strings.
   * @param {string} response
   * @returns {{atoms:string[], rawResponse:string, atomCount:number}}
   */
  parseSymbolizerResponse(response) {
    const atoms = [];
    const lines = response.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      if (line.startsWith('(') && line.endsWith(')')) {
        atoms.push(line.trim());
      }
    });

    return {
      atoms,
      rawResponse: response,
      atomCount: atoms.length
    };
  }

  /**
   * Heuristic fallback extraction when LLM is unavailable.
   * @param {string} transcript
   * @returns {{atoms:string[], rawResponse:string, atomCount:number}}
   */
  fallbackSymbolizer(transcript) {
    // Simple rule-based fallback for critical terms
    const commonPlants = ['aloe', 'neem', 'moringa', 'lemongrass'];
    const commonRelations = ['treats', 'used_for', 'found_in', 'prepared_by'];
    
    const atoms = [];
    const words = transcript.toLowerCase().split(' ');

    // Simple entity extraction
    commonPlants.forEach(plant => {
      if (transcript.toLowerCase().includes(plant)) {
        atoms.push(`(plant "${plant}")`);
      }
    });

    return {
      atoms,
      rawResponse: 'Fallback extraction',
      atomCount: atoms.length
    };
  }

  /**
   * Validate basic MeTTa atom syntax and return valid/invalid sets.
   * @param {string[]} atoms
   * @returns {{valid:string[], invalid:string[], validationScore:number}}
   */
  validateAtoms(atoms) {
    const validAtoms = atoms.filter(atom => {
      return atom.startsWith('(') && 
             atom.endsWith(')') && 
             atom.split(' ').length >= 2;
    });
    
    return {
      valid: validAtoms,
      invalid: atoms.filter(atom => !validAtoms.includes(atom)),
      validationScore: validAtoms.length / atoms.length
    };
  }
}

module.exports = new SymbolizerService();