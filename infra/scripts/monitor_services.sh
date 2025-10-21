#!/bin/bash

echo "📊 AfriVerse Services Monitor"

check_service() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        echo "✅ $name: HEALTHY"
        return 0
    else
        echo "❌ $name: UNHEALTHY"
        return 1
    fi
}

check_docker_service() {
    local service=$1
    
    if docker-compose -f docker-compose.yml ps "$service" | grep -q "Up"; then
        echo "✅ $service: RUNNING"
        return 0
    else
        echo "❌ $service: STOPPED"
        return 1
    fi
}

echo "🔍 Checking Docker services..."
check_docker_service "postgres"
check_docker_service "redis"
check_docker_service "ipfs"
check_docker_service "backend"
check_docker_service "frontend"

echo ""
echo "🔍 Checking service endpoints..."
check_service "Backend API" "http://localhost:4000/health"
check_service "Frontend" "http://localhost:3000"
check_service "IPFS API" "http://localhost:5001/api/v0/version"

echo ""
echo "📈 System resources:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"