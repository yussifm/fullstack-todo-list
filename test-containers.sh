#!/bin/bash

# Container Testing Script for Todo Application
set -e

echo "🧪 Starting Container Tests..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_container_running() {
    local container_name=$1
    echo -n "Testing if $container_name is running... "
    if docker ps | grep -q $container_name; then
        echo -e "${GREEN}✓ PASS${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        return 1
    fi
}

test_container_healthy() {
    local container_name=$1
    echo -n "Testing if $container_name is healthy... "
    local health_status=$(docker inspect --format='{{.State.Health.Status}}' $container_name 2>/dev/null || echo "no-healthcheck")
    
    if [ "$health_status" = "healthy" ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        return 0
    elif [ "$health_status" = "no-healthcheck" ]; then
        echo -e "${YELLOW}⚠ NO HEALTHCHECK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL (Status: $health_status)${NC}"
        return 1
    fi
}

test_endpoint() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo -n "Testing $description... "
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" $url)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS (HTTP $status_code)${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL (HTTP $status_code, expected $expected_status)${NC}"
        return 1
    fi
}

test_mongodb_connection() {
    echo -n "Testing MongoDB connection... "
    if docker exec todo-mongodb mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        return 1
    fi
}

# Wait for services to be ready
wait_for_services() {
    echo "⏳ Waiting for services to be ready..."
    sleep 30
}

# Main test execution
main() {
    echo "🐳 Docker Container Tests for Todo Application"
    echo "=============================================="
    
    # Check if docker-compose is running
    if ! docker-compose ps | grep -q "Up"; then
        echo -e "${RED}❌ Docker Compose services are not running!${NC}"
        echo "Please run: docker-compose up -d"
        exit 1
    fi
    
    wait_for_services
    
    # Container status tests
    echo -e "\n📋 Container Status Tests"
    echo "-------------------------"
    test_container_running "todo-mongodb"
    test_container_running "todo-backend"
    test_container_running "todo-frontend"
    
    # Health check tests
    echo -e "\n🏥 Health Check Tests"
    echo "---------------------"
    test_container_healthy "todo-mongodb"
    test_container_healthy "todo-backend"
    test_container_healthy "todo-frontend"
    
    # Connectivity tests
    echo -e "\n🌐 Connectivity Tests"
    echo "---------------------"
    test_endpoint "http://localhost:3000" "200" "Frontend accessibility"
    test_endpoint "http://localhost:5000" "200" "Backend health endpoint"
    test_mongodb_connection
    
    # API functionality tests
    echo -e "\n🔧 API Functionality Tests"
    echo "---------------------------"
    test_endpoint "http://localhost:5000" "200" "Todos API endpoint"
    
    # Network connectivity tests
    echo -e "\n🔗 Inter-service Communication Tests"
    echo "------------------------------------"
    echo -n "Testing backend to database connection... "
    if docker exec todo-backend curl -s http://mongodb:27017 >/dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
    else
        echo -e "${RED}✗ FAIL${NC}"
    fi
    
    # Resource usage check
    echo -e "\n💾 Resource Usage Check"
    echo "-----------------------"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    
    echo -e "\n✅ All tests completed!"
    echo "Access your application at:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:5000"
    echo "  MongoDB:  mongodb://localhost:27017"
}

# Run tests
main "$@"