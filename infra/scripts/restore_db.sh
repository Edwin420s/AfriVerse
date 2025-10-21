#!/bin/bash

set -e

echo "🔄 AfriVerse Database Restore Script"

# Configuration
BACKUP_DIR="./backups"
RESTORE_FILE=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

list_backups() {
    echo "📋 Available backups:"
    local count=0
    for file in "$BACKUP_DIR"/*.gz; do
        if [ -f "$file" ]; then
            local filename=$(basename "$file")
            local size=$(du -h "$file" | cut -f1)
            local date=$(stat -f "%Sm" "$file" 2>/dev/null || stat -c "%y" "$file")
            echo "  $((++count)). $filename ($size) - $date"
        fi
    done
    
    if [ $count -eq 0 ]; then
        echo -e "${YELLOW}⚠️ No backups found in $BACKUP_DIR${NC}"
        exit 1
    fi
}

download_from_ipfs() {
    local cid="$1"
    local output_file="$2"
    
    echo "📥 Downloading backup from IPFS: $cid"
    
    if curl -s -X POST "http://localhost:5001/api/v0/cat?arg=$cid" > "$output_file"; then
        if [ -s "$output_file" ]; then
            echo -e "${GREEN}✅ Backup downloaded from IPFS${NC}"
            return 0
        fi
    fi
    
    echo -e "${RED}❌ Failed to download from IPFS${NC}"
    return 1
}

decompress_backup() {
    local compressed_file="$1"
    local output_file="$2"
    
    echo "🗜️ Decompressing backup..."
    
    if gzip -dc "$compressed_file" > "$output_file"; then
        echo -e "${GREEN}✅ Backup decompressed${NC}"
        return 0
    else
        echo -e "${RED}❌ Backup decompression failed${NC}"
        return 1
    fi
}

verify_restore_file() {
    local file="$1"
    
    echo "🔍 Verifying restore file..."
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Restore file not found: $file${NC}"
        return 1
    fi
    
    if [ ! -s "$file" ]; then
        echo -e "${RED}❌ Restore file is empty${NC}"
        return 1
    fi
    
    # Basic SQL validation
    if head -n 10 "$file" | grep -q "PostgreSQL database dump"; then
        echo -e "${GREEN}✅ Valid PostgreSQL dump file${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️ File may not be a valid PostgreSQL dump${NC}"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return 1
        fi
        return 0
    fi
}

restore_docker() {
    local restore_file="$1"
    
    echo "🐳 Restoring to Docker PostgreSQL..."
    
    if docker-compose -f docker-compose.yml ps postgres | grep -q "Up"; then
        # Drop and recreate database
        docker-compose -f docker-compose.yml exec -T postgres psql -U afri -c "DROP DATABASE IF EXISTS afriverse;"
        docker-compose -f docker-compose.yml exec -T postgres psql -U afri -c "CREATE DATABASE afriverse;"
        
        # Restore from backup
        docker-compose -f docker-compose.yml exec -T postgres psql -U afri -d afriverse < "$restore_file"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Docker restore completed successfully${NC}"
            return 0
        else
            echo -e "${RED}❌ Docker restore failed${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ PostgreSQL container not running${NC}"
        return 1
    fi
}

restore_k8s() {
    local restore_file="$1"
    
    echo "☸️ Restoring to Kubernetes PostgreSQL..."
    
    local pod_name=$(kubectl get pods -n afriverse -l app=postgres -o jsonpath='{.items[0].metadata.name}')
    
    if [ -n "$pod_name" ]; then
        # Copy backup file to pod
        kubectl cp "$restore_file" "afriverse/$pod_name:/tmp/restore.sql"
        
        # Drop and recreate database
        kubectl exec -n afriverse "$pod_name" -- psql -U afri -c "DROP DATABASE IF EXISTS afriverse;"
        kubectl exec -n afriverse "$pod_name" -- psql -U afri -c "CREATE DATABASE afriverse;"
        
        # Restore from backup
        kubectl exec -n afriverse "$pod_name" -- psql -U afri -d afriverse -f /tmp/restore.sql
        
        # Cleanup
        kubectl exec -n afriverse "$pod_name" -- rm -f /tmp/restore.sql
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Kubernetes restore completed successfully${NC}"
            return 0
        else
            echo -e "${RED}❌ Kubernetes restore failed${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ PostgreSQL pod not found${NC}"
        return 1
    fi
}

run_migrations() {
    echo "🔄 Running database migrations..."
    
    # Run Prisma migrations
    cd ../services/backend
    
    if command -v npx >/dev/null 2>&1; then
        npx prisma migrate deploy
        echo -e "${GREEN}✅ Database migrations completed${NC}"
    else
        echo -e "${YELLOW}⚠️ npx not available, skipping migrations${NC}"
    fi
}

main() {
    echo "🚀 Starting AfriVerse Database Restore"
    echo "======================================"
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -f|--file)
                RESTORE_FILE="$2"
                shift 2
                ;;
            -c|--cid)
                IPFS_CID="$2"
                shift 2
                ;;
            -l|--list)
                list_backups
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Get restore file
    if [ -n "$IPFS_CID" ]; then
        RESTORE_FILE="$BACKUP_DIR/ipfs_restore.sql.gz"
        download_from_ipfs "$IPFS_CID" "$RESTORE_FILE" || exit 1
    elif [ -z "$RESTORE_FILE" ]; then
        list_backups
        read -p "📝 Enter backup filename: " RESTORE_FILE
    fi
    
    # Ensure full path
    if [[ "$RESTORE_FILE" != /* ]]; then
        RESTORE_FILE="$BACKUP_DIR/$RESTORE_FILE"
    fi
    
    # Decompress if needed
    local decompressed_file="$BACKUP_DIR/restore_$(date +%Y%m%d_%H%M%S).sql"
    if [[ "$RESTORE_FILE" == *.gz ]]; then
        decompress_backup "$RESTORE_FILE" "$decompressed_file" || exit 1
    else
        cp "$RESTORE_FILE" "$decompressed_file"
    fi
    
    # Verify file
    verify_restore_file "$decompressed_file" || exit 1
    
    # Confirm restore
    echo ""
    echo -e "${RED}⚠️ WARNING: This will COMPLETELY REPLACE the current database${NC}"
    echo -e "${RED}   All current data will be LOST!${NC}"
    echo ""
    read -p "Are you sure you want to continue? (type 'YES' to confirm): " -r
    if [[ ! $REPLY == "YES" ]]; then
        echo "Restore cancelled."
        rm -f "$decompressed_file"
        exit 0
    fi
    
    # Perform restore
    if ! restore_docker "$decompressed_file"; then
        echo -e "${YELLOW}⚠️ Falling back to Kubernetes restore${NC}"
        restore_k8s "$decompressed_file" || exit 1
    fi
    
    # Run migrations
    run_migrations
    
    # Cleanup
    rm -f "$decompressed_file"
    
    echo ""
    echo -e "${GREEN}🎉 Database restore completed successfully!${NC}"
}

# Run main function
main "$@"