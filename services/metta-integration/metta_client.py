#!/usr/bin/env python3
"""
MeTTa Client for AfriVerse - Symbolic AI Integration
Uses Hyperon MeTTa runtime for proper symbolic reasoning
"""

import json
from typing import List, Dict, Any, Optional

try:
    from hyperon import MeTTa, AtomSpace
    HYPERON_AVAILABLE = True
except ImportError:
    HYPERON_AVAILABLE = False
    print("Warning: hyperon not installed. Install with: pip install hyperon")

class MeTTaClient:
    def __init__(self):
        """Initialize MeTTa runtime with AtomSpace"""
        if not HYPERON_AVAILABLE:
            raise RuntimeError("Hyperon MeTTa not installed. Run: pip install hyperon")
        
        self.metta = MeTTa()
        self.space = AtomSpace()
        self.metta.space = self.space
        
        # Track atom count
        self.atom_count = 0
    
    def evaluate(self, expression: str) -> Dict[str, Any]:
        """Evaluate a MeTTa expression"""
        try:
            result = self.metta.run(expression)
            return {
                "success": True,
                "result": str(result),
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "result": None
            }
    
    def add_atoms(self, atoms: List[str]) -> Dict[str, Any]:
        """Add multiple atoms to the knowledge base"""
        try:
            added = 0
            for atom in atoms:
                self.metta.run(atom)
                added += 1
                self.atom_count += 1
            
            return {
                "success": True,
                "added": added,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "added": 0
            }
    
    def query(self, pattern: str) -> Dict[str, Any]:
        """Query the knowledge base with a pattern"""
        try:
            # Use match for pattern matching
            query_expr = f"(match &self {pattern} $result)"
            result = self.metta.run(query_expr)
            
            # Parse results
            matches = []
            if result:
                # Convert result to list of matches
                result_str = str(result)
                matches = [result_str]
            
            return {
                "success": True,
                "matches": matches,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "matches": []
            }
    
    def health_check(self) -> bool:
        """Check if MeTTa runtime is working"""
        try:
            # Try a simple evaluation
            result = self.metta.run("(+ 1 1)")
            return True
        except:
            return False
    
    def clear_knowledge_base(self) -> Dict[str, Any]:
        """Clear all atoms (for testing)"""
        try:
            # Reinitialize space
            self.space = AtomSpace()
            self.metta.space = self.space
            self.atom_count = 0
            return {
                "success": True,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_atom_count(self) -> int:
        """Get total number of atoms in knowledge base"""
        return self.atom_count

# Example usage and helper functions
class AfriVerseMeTTa:
    def __init__(self):
        self.client = MeTTaClient()
    
    def add_cultural_knowledge(self, atoms: List[str]) -> bool:
        """Add cultural knowledge atoms to MeTTa"""
        result = self.client.add_atoms(atoms)
        return result.get('success', False)
    
    def find_medicinal_plants(self, condition: str) -> List[str]:
        """Find plants that treat a specific condition"""
        query = f'(treats ?plant "{condition}")'
        result = self.client.query(query)
        
        plants = []
        for match in result.get('matches', []):
            if 'plant' in match:
                plants.append(match['plant'])
        
        return plants
    
    def get_plant_properties(self, plant_name: str) -> Dict[str, Any]:
        """Get all properties and uses of a plant"""
        properties = []
        uses = []
        regions = []
        
        # Query properties
        prop_result = self.client.query(f'(property "{plant_name}" ?prop)')
        properties = [match['prop'] for match in prop_result.get('matches', [])]
        
        # Query uses
        use_result = self.client.query(f'(used_for "{plant_name}" ?use)')
        uses = [match['use'] for match in use_result.get('matches', [])]
        
        # Query regions
        region_result = self.client.query(f'(found_in "{plant_name}" ?region)')
        regions = [match['region'] for match in region_result.get('matches', [])]
        
        return {
            'plant': plant_name,
            'properties': properties,
            'uses': uses,
            'regions': regions
        }
    
    def infer_medicinal_uses(self, plant: str) -> List[str]:
        """Infer medicinal uses based on plant properties"""
        # This is a simple inference - in production would use more complex reasoning
        query = f'''
        (match (plant "{plant}")
               (property "{plant}" ?prop)
               (implies (property ?p ?prop) (has_medicinal_use ?p)))
        '''
        
        result = self.client.evaluate(query)
        return result.get('result', [])
    
    def validate_knowledge_graph(self) -> Dict[str, Any]:
        """Run validation checks on the knowledge graph"""
        checks = {
            'total_atoms': self.client.get_atom_count(),
            'plant_count': len(self.client.query('(plant ?p)').get('matches', [])),
            'practice_count': len(self.client.query('(practice ?p)').get('matches', [])),
            'proverb_count': len(self.client.query('(proverb ?p)').get('matches', [])),
            'server_healthy': self.client.health_check()
        }
        
        return checks

# Example usage
if __name__ == "__main__":
    metta = AfriVerseMeTTa()
    
    # Check health
    if metta.client.health_check():
        print("MeTTa server is healthy")
        
        # Run validation
        validation = metta.validate_knowledge_graph()
        print(f"Knowledge Graph Status: {validation}")
        
        # Example query
        plants_for_burns = metta.find_medicinal_plants("burn")
        print(f"Plants for burns: {plants_for_burns}")
        
        # Get plant details
        if plants_for_burns:
            details = metta.get_plant_properties(plants_for_burns[0])
            print(f"Plant details: {details}")
    else:
        print("MeTTa server is not available")