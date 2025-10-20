const axios = require('axios');

class MeTTaService {
  constructor() {
    this.mettaEndpoint = process.env.METTA_API_URL || 'http://localhost:8080';
  }

  async evaluateExpression(expression) {
    try {
      const response = await axios.post(`${this.mettaEndpoint}/evaluate`, {
        expression
      });

      return {
        success: true,
        result: response.data.result,
        atoms: response.data.atoms || []
      };
    } catch (error) {
      console.error('MeTTa Evaluation Error:', error);
      return {
        success: false,
        error: error.message,
        result: null
      };
    }
  }

  async addAtoms(atoms) {
    try {
      const response = await axios.post(`${this.mettaEndpoint}/atoms`, {
        atoms
      });

      return {
        success: true,
        addedCount: response.data.added,
        totalAtoms: response.data.total
      };
    } catch (error) {
      console.error('MeTTa Add Atoms Error:', error);
      
      // Fallback to JSON storage for MVP
      return this.storeAtomsFallback(atoms);
    }
  }

  async queryAtoms(pattern) {
    try {
      const response = await axios.post(`${this.mettaEndpoint}/query`, {
        pattern
      });

      return {
        success: true,
        matches: response.data.matches,
        count: response.data.count
      };
    } catch (error) {
      console.error('MeTTa Query Error:', error);
      return this.queryAtomsFallback(pattern);
    }
  }

  // Fallback implementations for MVP
  async storeAtomsFallback(atoms) {
    // Simple in-memory storage for demo
    if (!this.atomStore) {
      this.atomStore = new Set();
    }

    atoms.forEach(atom => {
      this.atomStore.add(atom);
    });

    return {
      success: true,
      addedCount: atoms.length,
      totalAtoms: this.atomStore.size,
      fallback: true
    };
  }

  async queryAtomsFallback(pattern) {
    if (!this.atomStore) {
      return { success: true, matches: [], count: 0, fallback: true };
    }

    const matches = Array.from(this.atomStore).filter(atom => 
      atom.includes(pattern.replace('?', ''))
    );

    return {
      success: true,
      matches,
      count: matches.length,
      fallback: true
    };
  }

  validateMeTTaSyntax(expression) {
    const syntaxChecks = {
      hasParentheses: expression.startsWith('(') && expression.endsWith(')'),
      hasContent: expression.length > 2,
      balancedParentheses: this.checkBalancedParentheses(expression)
    };

    const isValid = Object.values(syntaxChecks).every(check => check);
    
    return {
      isValid,
      checks: syntaxChecks
    };
  }

  checkBalancedParentheses(str) {
    let balance = 0;
    for (let char of str) {
      if (char === '(') balance++;
      if (char === ')') balance--;
      if (balance < 0) return false;
    }
    return balance === 0;
  }

  generateInference(atoms, query) {
    // Simple inference engine for demo
    const inferences = [];
    
    atoms.forEach(atom => {
      if (atom.includes('treats') && query.includes('treat')) {
        const parts = atom.match(/treats "([^"]+)" "([^"]+)"/);
        if (parts) {
          inferences.push({
            type: 'treatment',
            plant: parts[1],
            condition: parts[2],
            confidence: 0.8,
            source: atom
          });
        }
      }
    });

    return inferences;
  }
}

module.exports = new MeTTaService();