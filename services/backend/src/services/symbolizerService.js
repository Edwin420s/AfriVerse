const { OpenAI } = require('openai');

class SymbolizerService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

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