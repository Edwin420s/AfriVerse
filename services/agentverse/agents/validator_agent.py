from uagents import Agent, Bureau, Context, Model
import requests
import os
import json
from typing import List, Dict, Any

class ValidationRequest(Model):
    entry_id: int
    validators: List[str]
    atoms: List[str]
    context: Dict[str, Any] = {}

class ValidationResult(Model):
    entry_id: int
    validator: str
    decision: str  # 'approved' or 'rejected'
    confidence: float
    notes: str = ""
    validated_atoms: List[str] = []

class ValidatorAgent(Agent):
    def __init__(self):
        super().__init__(
            name="validator_agent",
            seed="validator_agent_recovery_phrase_afriverse",
            port=8005
        )
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:4000")
        self.community_validators = self.load_community_validators()
        
    @self.on_message(model=ValidationRequest)
    async def handle_validation_request(self, ctx: Context, sender: str, request: ValidationRequest):
        ctx.logger.info(f"Processing validation for entry {request.entry_id}")
        
        try:
            # Validate atoms against community knowledge
            validation_results = await self.validate_atoms(
                request.atoms, 
                request.context
            )
            
            # Aggregate results from multiple validators
            aggregated_decision = await self.aggregate_decisions(
                validation_results, 
                request.validators
            )
            
            # Update backend with validation results
            await self.update_backend(
                request.entry_id,
                aggregated_decision,
                validation_results
            )
            
            # Send results back
            for result in validation_results:
                await ctx.send(sender, result)
                
        except Exception as e:
            ctx.logger.error(f"Validation failed for entry {request.entry_id}: {str(e)}")
            # Send error result
            error_result = ValidationResult(
                entry_id=request.entry_id,
                validator=self.address,
                decision="rejected",
                confidence=0.0,
                notes=f"Validation error: {str(e)}"
            )
            await ctx.send(sender, error_result)
    
    async def validate_atoms(self, atoms: List[str], context: Dict[str, Any]) -> List[ValidationResult]:
        """Validate atoms against community knowledge and rules"""
        results = []
        
        for atom in atoms:
            try:
                # Check atom syntax
                if not self.is_valid_atom_syntax(atom):
                    results.append(ValidationResult(
                        entry_id=context.get('entry_id', 0),
                        validator=self.address,
                        decision="rejected",
                        confidence=0.9,
                        notes=f"Invalid atom syntax: {atom}",
                        validated_atoms=[]
                    ))
                    continue
                
                # Check for cultural sensitivity
                sensitivity_check = await self.check_cultural_sensitivity(atom, context)
                if not sensitivity_check['approved']:
                    results.append(ValidationResult(
                        entry_id=context.get('entry_id', 0),
                        validator=self.address,
                        decision="rejected",
                        confidence=0.8,
                        notes=f"Culturally sensitive content: {sensitivity_check['reason']}",
                        validated_atoms=[]
                    ))
                    continue
                
                # Check knowledge consistency
                consistency_check = await self.check_knowledge_consistency(atom, context)
                
                # If all checks pass, approve the atom
                if consistency_check['consistent']:
                    results.append(ValidationResult(
                        entry_id=context.get('entry_id', 0),
                        validator=self.address,
                        decision="approved",
                        confidence=consistency_check['confidence'],
                        notes="Atom validated successfully",
                        validated_atoms=[atom]
                    ))
                else:
                    results.append(ValidationResult(
                        entry_id=context.get('entry_id', 0),
                        validator=self.address,
                        decision="rejected",
                        confidence=consistency_check['confidence'],
                        notes=f"Knowledge inconsistency: {consistency_check['reason']}",
                        validated_atoms=[]
                    ))
                    
            except Exception as e:
                ctx.logger.error(f"Atom validation error: {str(e)}")
                results.append(ValidationResult(
                    entry_id=context.get('entry_id', 0),
                    validator=self.address,
                    decision="rejected",
                    confidence=0.0,
                    notes=f"Validation error: {str(e)}",
                    validated_atoms=[]
                ))
        
        return results
    
    def is_valid_atom_syntax(self, atom: str) -> bool:
        """Check if atom has valid MeTTa syntax"""
        return (atom.startswith('(') and 
                atom.endswith(')') and 
                len(atom.split()) >= 2)
    
    async def check_cultural_sensitivity(self, atom: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Check if atom contains culturally sensitive content"""
        sensitive_terms = [
            'sacred', 'secret', 'restricted', 'initiation',
            'elder_only', 'gender_restricted'
        ]
        
        atom_lower = atom.lower()
        for term in sensitive_terms:
            if term in atom_lower:
                return {
                    'approved': False,
                    'reason': f"Contains sensitive term: {term}"
                }
        
        return {'approved': True}
    
    async def check_knowledge_consistency(self, atom: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Check if atom is consistent with existing knowledge"""
        try:
            # Query existing knowledge for consistency
            query_url = f"{self.backend_url}/api/entries/query"
            
            # Extract key terms from atom for consistency checking
            key_terms = self.extract_key_terms(atom)
            
            query_data = {
                'query': f"Check consistency for: {atom}",
                'context': {
                    'key_terms': key_terms,
                    'community': context.get('community', 'general')
                }
            }
            
            response = requests.post(query_url, json=query_data)
            response.raise_for_status()
            
            result = response.json()
            
            # Simple consistency check based on confidence
            if result.get('confidence', 0) > 0.7:
                return {
                    'consistent': True,
                    'confidence': result['confidence'],
                    'reason': 'Consistent with existing knowledge'
                }
            else:
                return {
                    'consistent': False,
                    'confidence': result.get('confidence', 0.3),
                    'reason': 'Low confidence in existing knowledge'
                }
                
        except Exception as e:
            # If check fails, be conservative and reject
            return {
                'consistent': False,
                'confidence': 0.2,
                'reason': f'Consistency check failed: {str(e)}'
            }
    
    def extract_key_terms(self, atom: str) -> List[str]:
        """Extract key terms from atom for consistency checking"""
        # Remove parentheses and split
        content = atom[1:-1].strip()
        terms = content.split()
        
        # Filter out common predicates
        common_predicates = ['is_a', 'has', 'treats', 'found_in', 'used_for']
        key_terms = [term.strip('"') for term in terms if term not in common_predicates]
        
        return key_terms
    
    async def aggregate_decisions(self, results: List[ValidationResult], validators: List[str]) -> Dict[str, Any]:
        """Aggregate validation results from multiple validators"""
        if not results:
            return {'decision': 'rejected', 'confidence': 0.0}
        
        approved_count = sum(1 for r in results if r.decision == 'approved')
        total_count = len(results)
        
        approval_rate = approved_count / total_count if total_count > 0 else 0
        
        # Calculate average confidence
        avg_confidence = sum(r.confidence for r in results) / total_count if total_count > 0 else 0
        
        # Make decision based on approval rate and confidence
        if approval_rate >= 0.7 and avg_confidence >= 0.6:
            decision = 'approved'
        else:
            decision = 'rejected'
        
        return {
            'decision': decision,
            'confidence': avg_confidence,
            'approval_rate': approval_rate,
            'total_validations': total_count,
            'approved_count': approved_count
        }
    
    async def update_backend(self, entry_id: int, decision: Dict[str, Any], results: List[ValidationResult]):
        """Update backend with validation results"""
        update_url = f"{self.backend_url}/api/validate/{entry_id}"
        
        data = {
            'decision': decision['decision'],
            'notes': f"Automated validation: {decision['approval_rate']*100:.1f}% approval rate",
            'validator': f"validator_agent_{self.address}",
            'confidence': decision['confidence']
        }
        
        response = requests.post(update_url, json=data)
        response.raise_for_status()
    
    def load_community_validators(self) -> Dict[str, List[str]]:
        """Load community validators from configuration"""
        # This would typically load from a database or config file
        return {
            'general': ['validator1', 'validator2', 'validator3'],
            'kikuyu': ['kikuyu_elder1', 'kikuyu_elder2'],
            'maasai': ['maasai_elder1', 'maasai_elder2']
        }
    
    @self.on_interval(period=120.0)
    async def update_validator_list(self, ctx: Context):
        """Periodically update validator list from backend"""
        try:
            validators_url = f"{self.backend_url}/api/validators"
            response = requests.get(validators_url)
            
            if response.status_code == 200:
                new_validators = response.json()
                self.community_validators = new_validators
                ctx.logger.info("Updated validator list from backend")
                
        except Exception as e:
            ctx.logger.error(f"Failed to update validator list: {str(e)}")

# Create agent
validator_agent = ValidatorAgent()