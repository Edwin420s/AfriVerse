from uagents import Agent, Context, Model
import requests
import os

class QueryRequest(Model):
    query: str
    user_id: str = "anonymous"
    context: dict = {}

class QueryResponse(Model):
    success: bool
    answer: str
    reasoning_trace: list = []
    sources: list = []
    confidence: float = 0.0
    error: str = None

class QueryAgent(Agent):
    def __init__(self):
        super().__init__(
            name="query_agent",
            seed="query_agent_recovery_phrase_afriverse",
            port=8003
        )
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:4000")
        
    @self.on_message(model=QueryRequest)
    async def handle_query(self, ctx: Context, sender: str, request: QueryRequest):
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
        """Process natural language query"""
        query_url = f"{self.backend_url}/api/query"
        
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
        """Regular health check"""
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