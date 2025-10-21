#!/usr/bin/env python3
"""
Main script to run all AfriVerse agents
"""

from agents.ingest_agent import ingest_agent
from agents.symbolizer_agent import symbolizer_agent
from agents.query_agent import query_agent
from uagents import Bureau

def main():
    # Create bureau and register all agents
    bureau = Bureau()
    
    bureau.add(ingest_agent)
    bureau.add(symbolizer_agent)
    bureau.add(query_agent)
    
    print("Starting AfriVerse Agent Bureau...")
    print(f" - Ingest Agent: {ingest_agent.address}")
    print(f" - Symbolizer Agent: {symbolizer_agent.address}")
    print(f" - Query Agent: {query_agent.address}")
    print("Agents are running...")
    
    # Run all agents
    bureau.run()

if __name__ == "__main__":
    main()