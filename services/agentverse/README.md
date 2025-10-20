# AfriVerse Agentverse Agents

Autonomous agents for the AfriVerse cultural knowledge preservation platform.

## Agents Overview

### Ingest Agent (`ingest_agent.py`)
- **Purpose**: Handles incoming cultural knowledge submissions
- **Responsibilities**:
  - Download files from IPFS
  - Route to appropriate processing pipelines
  - Manage submission workflow

### Transcribe Agent (`transcribe_agent.py`)
- **Purpose**: Convert audio/video content to text
- **Responsibilities**:
  - Speech-to-text conversion using OpenAI Whisper
  - Fallback to HuggingFace models
  - Language detection and processing

### Symbolizer Agent (`symbolizer_agent.py`)
- **Purpose**: Extract symbolic knowledge from text
- **Responsibilities**:
  - Convert natural language to MeTTa atoms
  - Entity and relationship extraction
  - Knowledge structure validation

### Validator Agent (`validator_agent.py`)
- **Purpose**: Validate cultural knowledge entries
- **Responsibilities**:
  - Cultural sensitivity checking
  - Knowledge consistency validation
  - Community standards enforcement

### Query Agent (`query_agent.py`)
- **Purpose**: Handle knowledge queries
- **Responsibilities**:
  - Natural language query processing
  - Symbolic reasoning and inference
  - Response generation with explanations

## Setup and Installation

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt

### Environment variables:
```
BACKEND_URL=http://localhost:4000
OPENAI_API_KEY=your_openai_key
HUGGINGFACE_TOKEN=your_hf_token
REDIS_URL=redis://localhost:6379
```

### Run agents: 
```
python run_agents.py
```

### Agent Communication
Agents communicate using the uAgents framework with the following message types:

IngestJob / IngestResult

TranscribeJob / TranscribeResult

SymbolizeJob / SymbolizeResult

ValidationRequest / ValidationResult

QueryRequest / QueryResponse

### Configuration
### Agent Ports
Ingest Agent: 8001

Transcribe Agent: 8004

Symbolizer Agent: 8002

Validator Agent: 8005

Query Agent: 8003

## Health Checks
Each agent performs regular health checks and reports status to the backend API.

## Deployment
Local Development
```
# Start all agents
python run_agents.py

# Start individual agents
python -m agents.ingest_agent
python -m agents.transcribe_agent
```
### Production
Use the provided Dockerfile to containerize agents:
```
docker build -t afriverse-agents .
docker run -p 8001-8005:8001-8005 afriverse-agents
```
## Monitoring
Agents log their activities and health status. Monitor logs for:

Processing completion rates

Error rates and types

Performance metrics

Resource usage

## Extending Agents
To add new agents:

Create agent class inheriting from Agent

Define message models using Model

Implement message handlers with @on_message

Add to run_agents.py bureau

Update requirements if needed

```

**34. services/metta-integration/README.md**
```markdown
# AfriVerse MeTTa Integration

Symbolic AI integration for cultural knowledge representation and reasoning.

## Overview

MeTTa (Meta-type Talk) is a symbolic AI language used for knowledge representation and cognitive computations. This integration enables AfriVerse to represent cultural knowledge as symbolic atoms and perform reasoning operations.

## Components

### MeTTa Client (`metta_client.py`)
Python client for interacting with MeTTa runtime:

- Atom storage and retrieval
- Query execution
- Inference operations
- Knowledge base management

### Example Atoms (`example_atoms.met`)
Sample cultural knowledge representations:

- Plant medicine knowledge
- Cultural proverbs and wisdom
- Rituals and practices
- Ecological knowledge
- Inference rules

## Usage

### Basic Operations

```python
from metta_client import MeTTaClient, AfriVerseMeTTa

# Initialize client
client = MeTTaClient("http://localhost:8080")

# Add cultural knowledge atoms
atoms = [
    '(plant "aloe_vera")',
    '(has_local_name "aloe_vera" "mwarubaini")',
    '(treats "aloe_vera" "burn")'
]
result = client.add_atoms(atoms)

# Query knowledge base
plants_for_burns = client.query('(treats ?plant "burn")')
```

## Cultural Knowledge Patterns
Plant Medicine
```
(plant "neem")
(has_local_name "neem" "muarubaini") 
(property "neem" "antibacterial")
(treats "neem" "malaria")
(used_for "neem" "traditional_tea")
```
## Cultural Proverbs
```
(proverb "When spider webs unite, they can tie up a lion.")
(meaning "unity" "strength")
(origin "ethiopia")
(language "amharic")
```

Inference Rules

```
(implies (and (plant ?p) (treats ?p ?d)) (has_medicinal_use ?p))
(implies (and (practice ?pr) (uses ?pr ?p)) (involves_plant ?pr ?p))
```
## Integration with Backend
### Symbolizer Service
The symbolizer service converts natural language transcripts to MeTTa atoms using LLM-powered extraction.

### Query Service
The query service uses MeTTa for symbolic reasoning and generates explanations with reasoning traces.

### Validation Service
Cultural knowledge validation uses MeTTa to check consistency and cultural appropriateness.

## Setup
### MeTTa Runtime
Install MeTTa:
```
# Follow instructions from metta-lang.dev
git clone https://github.com/trueagi-io/metta
cd metta
cargo build --release
```
### Start MeTTa server:
```
./target/release/metta --server --port 8080
```
## Python Client
```
pip install requests
python metta_client.py
```
## API Reference
### MeTTaClient Methods
evaluate(expression): Evaluate MeTTa expression

add_atoms(atoms): Add atoms to knowledge base

query(pattern): Query knowledge base

health_check(): Check server health

clear_knowledge_base(): Clear all atoms (testing)

### AfriVerseMeTTa Helper Methods
add_cultural_knowledge(atoms): Add cultural knowledge

find_medicinal_plants(condition): Find plants for conditions

get_plant_properties(plant_name): Get plant details

infer_medicinal_uses(plant): Infer uses from properties

validate_knowledge_graph(): Run validation checks

## Knowledge Representation Schema
### Core Predicates
(plant <name>): Plant entity

(property <subject> <value>): Entity properties

(treats <plant> <condition>): Medicinal relationships

(used_for <subject> <purpose>): Usage contexts

(found_in <subject> <region>): Geographical context

### Cultural Entities
(proverb <text>): Cultural proverbs

(ritual <name>): Cultural rituals

(practice <name>): Traditional practices

(ceremony <name>): Ceremonial events

###Provenance
(provenance <subject> <type> <value>): Source information

(license <content> <type>): Usage rights

(access_level <content> <level>): Access restrictions

## Reasoning Examples
### Simple Queries 
```
; Find all plants that treat burns
(match (treats ?plant "burn") (plant ?plant))

; Find practices using aloe vera  
(match (uses ?practice "aloe_vera") (practice ?practice))
```
## Inference Queries 
```
; Infer medicinal uses
(match (plant ?p) (property ?p ?prop) (implies (property ?x ?prop) (has_medicinal_use ?x)))

; Find related knowledge
(match (related ?subject ?related) (plant ?subject))
```

## Performance Considerations
Atom Storage: Use efficient indexing for large knowledge bases

Query Optimization: Pre-compile common query patterns

Caching: Cache frequent query results

Batch Operations: Use batch atom insertion for better performance 

## Testing
Run the example script to test integration: 
```
python metta_client.py
```
This will:

Check MeTTa server connectivity

Validate knowledge graph

Run example queries

Test inference capabilities 
```

This completes all the service files for the AfriVerse backend architecture. The services include:

**Backend API**:
- Complete REST API with controllers, routes, and services
- Database models and migrations
- Job queue system for background processing
- Utility functions for validation, crypto, and responses
- Configuration management

**Agent System**:
- Ingest agent for submission processing
- Transcribe agent for audio-to-text conversion
- Symbolizer agent for knowledge extraction
- Validator agent for cultural validation
- Query agent for knowledge retrieval

**AI Integration**:
- MeTTa symbolic AI client and examples
- OpenAI and HuggingFace integrations
- Knowledge representation schemas

All services are designed to work together in a microservices architecture with proper error handling, validation, and scalability.
```
