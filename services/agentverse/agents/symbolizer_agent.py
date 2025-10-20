from uagents import Agent, Context, Model
import requests
import os
import json

class SymbolizeJob(Model):
    entry_id: int
    transcript: str
    context: dict = {}

class SymbolizeResult(Model):
    entry_id: int
    success: bool
    atoms: list = []
    error: str = None

class SymbolizerAgent(Agent):
    def __init__(self):
        super().__init__(
            name="symbolizer_agent",
            seed="symbolizer_agent_recovery_phrase_afriverse",
            port=8002
        )
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:4000")
        
    @self.on_message(model=SymbolizeJob)
    async def handle_symbolize_job(self, ctx: Context, sender: str, job: SymbolizeJob):
        ctx.logger.info(f"Symbolizing entry {job.entry_id}")
        
        try:
            # Extract atoms from transcript
            atoms = await self.extract_atoms(job.transcript, job.context)
            
            # Validate atoms
            valid_atoms = await self.validate_atoms(atoms)
            
            # Update backend with atoms
            await self.update_backend(job.entry_id, valid_atoms)
            
            # Send result
            result = SymbolizeResult(
                entry_id=job.entry_id,
                success=True,
                atoms=valid_atoms
            )
            await ctx.send(sender, result)
            
        except Exception as e:
            ctx.logger.error(f"Symbolization failed for {job.entry_id}: {str(e)}")
            result = SymbolizeResult(
                entry_id=job.entry_id,
                success=False,
                error=str(e)
            )
            await ctx.send(sender, result)
    
    async def extract_atoms(self, transcript: str, context: dict) -> list:
        """Extract MeTTa atoms from transcript using LLM"""
        symbolizer_url = f"{self.backend_url}/api/symbolize"
        
        data = {
            'transcript': transcript,
            'context': context
        }
        
        response = requests.post(symbolizer_url, json=data)
        response.raise_for_status()
        
        result = response.json()
        return result.get('atoms', [])
    
    async def validate_atoms(self, atoms: list) -> list:
        """Validate MeTTa syntax and structure"""
        valid_atoms = []
        
        for atom in atoms:
            if self.is_valid_atom(atom):
                valid_atoms.append(atom)
            else:
                # Try to fix common syntax issues
                fixed_atom = self.fix_atom_syntax(atom)
                if fixed_atom:
                    valid_atoms.append(fixed_atom)
        
        return valid_atoms
    
    def is_valid_atom(self, atom: str) -> bool:
        """Check if atom has valid MeTTa syntax"""
        return (atom.startswith('(') and 
                atom.endswith(')') and 
                len(atom.split()) >= 2)
    
    def fix_atom_syntax(self, atom: str) -> str:
        """Attempt to fix common syntax issues"""
        atom = atom.strip()
        if not atom.startswith('('):
            atom = '(' + atom
        if not atom.endswith(')'):
            atom = atom + ')'
        return atom if self.is_valid_atom(atom) else None
    
    async def update_backend(self, entry_id: int, atoms: list):
        """Update backend with extracted atoms"""
        update_url = f"{self.backend_url}/api/entries/{entry_id}/atoms"
        
        data = {
            'atoms': atoms,
            'status': 'symbolized'
        }
        
        response = requests.patch(update_url, json=data)
        response.raise_for_status()

# Create agent
symbolizer_agent = SymbolizerAgent()