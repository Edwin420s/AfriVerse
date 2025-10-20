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