"""Symbolizer Agent

Converts transcripts into MeTTa atoms by calling the backend symbolizer API,
performs basic validation/repair of atom syntax, updates the backend, and
returns results.

Env:
- BACKEND_URL: Backend base URL (default http://localhost:4000)
"""

from uagents import Agent, Context, Model
import requests
import os
import json

class SymbolizeJob(Model):
    """Message model: a request to symbolize a transcript into atoms."""
    entry_id: int
    transcript: str
    context: dict = {}

class SymbolizeResult(Model):
    """Message model: symbolization result with atoms or an error."""
    entry_id: int
    success: bool
    atoms: list = []
    error: str = None

class SymbolizerAgent(Agent):
    """Agent that requests atom extraction and validates the resulting atoms."""
    def __init__(self):
        super().__init__(
            name="symbolizer_agent",
            seed="symbolizer_agent_recovery_phrase_afriverse",
            port=8002
        )
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:4000")
        
    @self.on_message(model=SymbolizeJob)
    async def handle_symbolize_job(self, ctx: Context, sender: str, job: SymbolizeJob):
        """Extract and validate atoms for the given transcript, update backend, reply."""
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
        """Call backend symbolizer endpoint to extract MeTTa atoms from transcript."""
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
        """Ensure atoms follow basic MeTTa syntax; attempt trivial fixes where possible."""
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
        """Return True if atom looks like a parenthesized token sequence."""
        return (atom.startswith('(') and 
                atom.endswith(')') and 
                len(atom.split()) >= 2)
    
    def fix_atom_syntax(self, atom: str) -> str:
        """Best-effort fix for missing parentheses around an atom string."""
        atom = atom.strip()
        if not atom.startswith('('):
            atom = '(' + atom
        if not atom.endswith(')'):
            atom = atom + ')'
        return atom if self.is_valid_atom(atom) else None
    
    async def update_backend(self, entry_id: int, atoms: list):
        """PATCH extracted atoms and status to backend entry."""
        update_url = f"{self.backend_url}/api/entries/{entry_id}/atoms"
        
        data = {
            'atoms': atoms,
            'status': 'symbolized'
        }
        
        response = requests.patch(update_url, json=data)
        response.raise_for_status()

# Create agent
symbolizer_agent = SymbolizerAgent()