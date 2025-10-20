#!/usr/bin/env python3
"""
MeTTa Client for AfriVerse - Symbolic AI Integration
"""

import requests
import json
from typing import List, Dict, Any, Optional

class MeTTaClient:
    def __init__(self, endpoint: str = "http://localhost:8080"):
        self.endpoint = endpoint
        self.session = requests.Session()
    
    def evaluate(self, expression: str) -> Dict[str, Any]:
        """Evaluate a MeTTa expression"""
        try:
            response = self.session.post(
                f"{self.endpoint}/evaluate",
                json={"expression": expression},
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "result": None
            }
    
    def add_atoms(self, atoms: List[str]) -> Dict[str, Any]:
        """Add multiple atoms to the knowledge base"""
        try:
            response = self.session.post(
                f"{self.endpoint}/atoms",
                json={"atoms": atoms},
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "added": 0
            }
    
    def query(self, pattern: str) -> Dict[str, Any]:
        """Query the knowledge base with a pattern"""
        try:
            response = self.session.post(
                f"{self.endpoint}/query",
                json={"pattern": pattern},
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "matches": []
            }
    
    def health_check(self) -> bool:
        """Check if MeTTa server is healthy"""
        try:
            response = self.session.get(f"{self.endpoint}/health", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def clear_knowledge_base(self) -> Dict[str, Any]:
        """Clear all atoms (for testing)"""
        try:
            response = self.session.delete(f"{self.endpoint}/atoms")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_atom_count(self) -> int:
        """Get total number of atoms in knowledge base"""
        try:
            response = self.session.get(f"{self.endpoint}/atoms/count")
            response.raise_for_status()
            data = response.json()
            return data.get('count', 0)
        except:
            return 0

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