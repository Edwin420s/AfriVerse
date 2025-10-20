"""Ingest Agent

Handles incoming submission jobs by downloading media from IPFS, invoking the
transcription flow, and updating the backend with results. This agent is part
of the AfriVerse services responsible for cultural knowledge ingestion.

Env:
- BACKEND_URL: Base URL of AfriVerse backend API (default http://localhost:4000)
"""

from uagents import Agent, Bureau, Context, Model
import requests
import json
import os

class IngestJob(Model):
    """Message model: describes a unit of ingestion work.

    Attributes:
        entry_id: Backend entry identifier.
        cid: IPFS content identifier for the uploaded media.
        filename: Original filename (for metadata/logging).
        language: Preferred transcription language code.
        content_type: Media type (e.g., 'audio').
    """
    entry_id: int
    cid: str
    filename: str
    language: str = "sw"
    content_type: str = "audio"

class IngestResult(Model):
    """Message model: ingestion result returned to sender."""
    entry_id: int
    success: bool
    transcript: str = None
    error: str = None

class IngestAgent(Agent):
    """Agent that orchestrates download->transcribe->update backend for entries."""
    def __init__(self):
        super().__init__(
            name="ingest_agent",
            seed="ingest_agent_recovery_phrase_afriverse",
            port=8001
        )
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:4000")
        
    @self.on_message(model=IngestJob)
    async def handle_ingest_job(self, ctx: Context, sender: str, job: IngestJob):
        """Process an ingestion job and reply with an `IngestResult`."""
        ctx.logger.info(f"Received ingest job for entry {job.entry_id}")
        
        try:
            # Download file from IPFS
            file_data = await self.download_from_ipfs(job.cid)
            
            # Send to transcription service
            transcript = await self.transcribe_audio(file_data, job.language)
            
            # Update backend with transcript
            await self.update_backend(job.entry_id, transcript)
            
            # Send result
            result = IngestResult(
                entry_id=job.entry_id,
                success=True,
                transcript=transcript
            )
            await ctx.send(sender, result)
            
        except Exception as e:
            ctx.logger.error(f"Ingest failed for {job.entry_id}: {str(e)}")
            result = IngestResult(
                entry_id=job.entry_id,
                success=False,
                error=str(e)
            )
            await ctx.send(sender, result)
    
    async def download_from_ipfs(self, cid: str) -> bytes:
        """Download file bytes from IPFS via Pinata gateway."""
        pinata_gateway = f"https://gateway.pinata.cloud/ipfs/{cid}"
        response = requests.get(pinata_gateway)
        response.raise_for_status()
        return response.content
    
    async def transcribe_audio(self, audio_data: bytes, language: str) -> str:
        """Send audio to backend transcription endpoint and return transcript text."""
        transcription_url = f"{self.backend_url}/api/transcribe"
        
        files = {'file': ('audio.wav', audio_data, 'audio/wav')}
        data = {'language': language}
        
        response = requests.post(transcription_url, files=files, data=data)
        response.raise_for_status()
        
        result = response.json()
        return result.get('transcript', '')
    
    async def update_backend(self, entry_id: int, transcript: str):
        """Update backend entry with transcription result and status."""
        update_url = f"{self.backend_url}/api/entries/{entry_id}/transcript"
        
        data = {
            'transcript': transcript,
            'status': 'transcribed'
        }
        
        response = requests.patch(update_url, json=data)
        response.raise_for_status()

# Create and run agent
ingest_agent = IngestAgent()