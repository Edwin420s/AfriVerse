"""Query Agent

Handles natural language knowledge queries by delegating to the backend query
API and returning structured responses with reasoning traces and confidence.

Env:
- BACKEND_URL: Backend base URL (default http://localhost:4000)
"""

from uagents import Agent, Context, Model
import requests
import os

class QueryRequest(Model):
    """Message model describing a user query and optional context."""
    query: str
    user_id: str = "anonymous"
    context: dict = {}

class QueryResponse(Model):
    """Message model containing the query answer and metadata."""
    success: bool
    answer: str
    reasoning_trace: list = []
    sources: list = []
    confidence: float = 0.0
    error: str = None

class QueryAgent(Agent):
    """Agent that forwards queries to the backend and relays structured answers."""
    def __init__(self):
        super().__init__(
            name="query_agent",
            seed="query_agent_recovery_phrase_afriverse",
            port=8003
        )
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:4000")
        
    @self.on_message(model=QueryRequest)
    async def handle_query(self, ctx: Context, sender: str, request: QueryRequest):
        """Process incoming `QueryRequest` via backend and reply with `QueryResponse`."""
        ctx.logger.info(f"Processing query: {request.query}")
        
        try:
            # Process query through backend
            response = await self.process_query(request.query, request.context)
            
            # Send response
            await ctx.send(sender, response)
            
        except Exception as e:
            ctx.logger.error(f"Query processing failed: {str(e)}")
            response = QueryResponse(
                success=False,
                answer="",
                error=str(e)
            )
            await ctx.send(sender, response)
    
    async def process_query(self, query: str, context: dict) -> QueryResponse:
        """Forward the query to the backend query endpoint and parse response."""
        query_url = f"{self.backend_url}/api/entries/query"
        
        data = {
            'query': query,
            'context': context
        }
        
        response = requests.post(query_url, json=data)
        response.raise_for_status()
        
        result = response.json()
        
        return QueryResponse(
            success=True,
            answer=result.get('answer', ''),
            reasoning_trace=result.get('reasoning_trace', []),
            sources=result.get('sources', []),
            confidence=result.get('confidence', 0.0)
        )
    
    @self.on_interval(period=30.0)
    async def health_check(self, ctx: Context):
        """Periodic connectivity check against the backend health endpoint."""
        try:
            response = requests.get(f"{self.backend_url}/health")
            if response.status_code == 200:
                ctx.logger.info("Query agent healthy - backend connected")
            else:
                ctx.logger.warning("Backend health check failed")
        except Exception as e:
            ctx.logger.error(f"Health check failed: {str(e)}")

# Create agent
query_agent = QueryAgent()