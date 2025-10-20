from uagents import Agent, Bureau, Context, Model
import requests
import os
import tempfile
import json

class TranscribeJob(Model):
    entry_id: int
    cid: str
    language: str = "sw"
    content_type: str = "audio"

class TranscribeResult(Model):
    entry_id: int
    success: bool
    transcript: str = None
    language: str = None
    duration: float = None
    error: str = None

class TranscribeAgent(Agent):
    def __init__(self):
        super().__init__(
            name="transcribe_agent",
            seed="transcribe_agent_recovery_phrase_afriverse",
            port=8004
        )
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:4000")
        self.openai_key = os.getenv("OPENAI_API_KEY")
        
    @self.on_message(model=TranscribeJob)
    async def handle_transcribe_job(self, ctx: Context, sender: str, job: TranscribeJob):
        ctx.logger.info(f"Processing transcription for entry {job.entry_id}")
        
        try:
            # Download file from IPFS
            audio_data = await self.download_from_ipfs(job.cid)
            
            # Transcribe audio
            transcript_result = await self.transcribe_audio(audio_data, job.language)
            
            # Update backend with transcript
            await self.update_backend(
                job.entry_id, 
                transcript_result['transcript'],
                transcript_result['language'],
                transcript_result.get('duration')
            )
            
            # Send result
            result = TranscribeResult(
                entry_id=job.entry_id,
                success=True,
                transcript=transcript_result['transcript'],
                language=transcript_result['language'],
                duration=transcript_result.get('duration')
            )
            await ctx.send(sender, result)
            
        except Exception as e:
            ctx.logger.error(f"Transcription failed for {job.entry_id}: {str(e)}")
            result = TranscribeResult(
                entry_id=job.entry_id,
                success=False,
                error=str(e)
            )
            await ctx.send(sender, result)
    
    async def download_from_ipfs(self, cid: str) -> bytes:
        """Download file from IPFS"""
        pinata_gateway = f"https://gateway.pinata.cloud/ipfs/{cid}"
        response = requests.get(pinata_gateway)
        response.raise_for_status()
        return response.content
    
    async def transcribe_audio(self, audio_data: bytes, language: str) -> dict:
        """Transcribe audio using OpenAI Whisper"""
        try:
            # Try OpenAI Whisper first
            return await self.transcribe_with_openai(audio_data, language)
        except Exception as e:
            ctx.logger.warning(f"OpenAI transcription failed, trying HuggingFace: {str(e)}")
            # Fallback to HuggingFace
            return await self.transcribe_with_huggingface(audio_data, language)
    
    async def transcribe_with_openai(self, audio_data: bytes, language: str) -> dict:
        """Transcribe using OpenAI Whisper API"""
        # Save audio to temporary file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
            temp_file.write(audio_data)
            temp_path = temp_file.name
        
        try:
            # Use OpenAI Whisper API
            import openai
            openai.api_key = self.openai_key
            
            with open(temp_path, 'rb') as audio_file:
                response = openai.Audio.transcribe(
                    "whisper-1",
                    audio_file,
                    language=language,
                    response_format="verbose_json"
                )
            
            return {
                'transcript': response.text,
                'language': response.language,
                'duration': response.duration
            }
            
        finally:
            # Clean up temporary file
            os.unlink(temp_path)
    
    async def transcribe_with_huggingface(self, audio_data: bytes, language: str) -> dict:
        """Transcribe using HuggingFace model"""
        try:
            # Use a pre-trained speech recognition model
            API_URL = "https://api-inference.huggingface.co/models/facebook/wav2vec2-large-xlsr-53"
            headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_TOKEN')}"}
            
            response = requests.post(API_URL, headers=headers, data=audio_data)
            response.raise_for_status()
            
            result = response.json()
            
            return {
                'transcript': result.get('text', ''),
                'language': language,
                'duration': None
            }
            
        except Exception as e:
            raise Exception(f"HuggingFace transcription failed: {str(e)}")
    
    async def update_backend(self, entry_id: int, transcript: str, language: str, duration: float = None):
        """Update backend with transcription result"""
        update_url = f"{self.backend_url}/api/submit/{entry_id}/transcript"
        
        data = {
            'transcript': transcript,
            'status': 'transcribed',
            'language': language
        }
        
        if duration is not None:
            data['duration'] = duration
        
        response = requests.patch(update_url, json=data)
        response.raise_for_status()
    
    @self.on_interval(period=60.0)
    async def health_check(self, ctx: Context):
        """Regular health check"""
        try:
            # Test transcription with a small audio sample
            test_audio = b''  # Empty for now, just check connectivity
            await self.transcribe_audio(test_audio, "en")
            ctx.logger.info("Transcribe agent healthy")
        except Exception as e:
            ctx.logger.error(f"Transcribe agent health check failed: {str(e)}")

# Create agent
transcribe_agent = TranscribeAgent()