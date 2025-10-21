#!/bin/bash

set -e

echo "🔧 Setting up AfriVerse Local Development Environment"

check_docker() {
    if ! command -v docker >/dev/null 2>&1; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose >/dev/null 2>&1; then
        echo "❌ Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    echo "✅ Docker and Docker Compose are available"
}

setup_environment() {
    echo "📝 Setting up environment variables..."
    
    if [ ! -f .env.local ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from .env.example"
    else
        echo "⚠️ .env.local already exists"
    fi
}

start_infrastructure() {
    echo "🐳 Starting infrastructure services..."
    
    docker-compose -f docker-compose.yml up -d postgres redis ipfs
    
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Check if services are running
    if docker-compose -f docker-compose.yml ps | grep -q "Up"; then
        echo "✅ Infrastructure services started successfully"
    else
        echo "❌ Failed to start some services"
        exit 1
    fi
}

initialize_database() {
    echo "🗄️ Initializing database..."
    
    cd ../services/backend
    
    if command -v npx >/dev/null 2>&1; then
        npx prisma generate
        npx prisma db push
        echo "✅ Database initialized"
    else
        echo "⚠️ npx not available, skipping database initialization"
    fi
}

display_instructions() {
    echo ""
    echo "🎉 Local development environment is ready!"
    echo ""
    echo "Services running:"
    echo "  • PostgreSQL: localhost:5432"
    echo "  • Redis: localhost:6379"
    echo "  • IPFS: localhost:5001 (API), localhost:8080 (Gateway)"
    echo ""
    echo "Next steps:"
    echo "  1. Start backend: cd services/backend && npm run dev"
    echo "  2. Start frontend: cd frontend && npm run dev"
    echo "  3. Start agents: cd services/agentverse && python run_agents.py"
    echo ""
    echo "Access points:"
    echo "  • Frontend: http://localhost:3000"
    echo "  • Backend API: http://localhost:4000"
    echo "  • IPFS Gateway: http://localhost:8080"
    echo ""
}

main() {
    check_docker
    setup_environment
    start_infrastructure
    initialize_database
    display_instructions
}

main "$@"