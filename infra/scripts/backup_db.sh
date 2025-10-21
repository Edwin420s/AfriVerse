#!/bin/bash

set -e

echo "💾 AfriVerse Database Backup Script"

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="afriverse_backup_${TIMESTAMP}.sql"
RETENTION_DAYS=7

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        echo "📁 Creating backup directory: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
    fi
}

backup_docker() {
    echo "🐳 Creating database backup from Docker..."
    
    if docker-compose -f docker-compose.yml ps postgres | grep -q "Up"; then
        docker-compose -f docker-compose.yml exec -T postgres pg_dump \
            -U afri \
            -d afriverse \
            --clean \
            --if-exists \
            > "$BACKUP_DIR/$BACKUP_FILE"
        
        if [ $? -eq 0 ] && [ -s "$BACKUP_DIR/$BACKUP_FILE" ]; then
            echo -e "${GREEN}✅ Docker backup created: $BACKUP_FILE${NC}"
        else
            echo -e "${RED}❌ Docker backup failed${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️ PostgreSQL container not running${NC}"
        return 1
    fi
}

backup_k8s() {
    echo "☸️ Creating database backup from Kubernetes..."
    
    # Get PostgreSQL pod name
    local pod_name=$(kubectl get pods -n afriverse -l app=postgres -o jsonpath='{.items[0].metadata.name}')
    
    if [ -n "$pod_name" ]; then
        kubectl exec -n afriverse "$pod_name" -- \
            pg_dump -U afri -d afriverse --clean --if-exists \
            > "$BACKUP_DIR/k8s_$BACKUP_FILE"
        
        if [ $? -eq 0 ] && [ -s "$BACKUP_DIR/k8s_$BACKUP_FILE" ]; then
            echo -e "${GREEN}✅ Kubernetes backup created: k8s_$BACKUP_FILE${NC}"
        else
            echo -e "${RED}❌ Kubernetes backup failed${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️ PostgreSQL pod not found${NC}"
        return 1
    fi
}

compress_backup() {
    echo "🗜️ Compressing backup file..."
    
    local backup_file="$1"
    
    if [ -f "$BACKUP_DIR/$backup_file" ]; then
        gzip "$BACKUP_DIR/$backup_file"
        echo -e "${GREEN}✅ Backup compressed: $backup_file.gz${NC}"
    fi
}

upload_to_ipfs() {
    local backup_file="$1"
    
    if [ -f "$BACKUP_DIR/$backup_file.gz" ]; then
        echo "📤 Uploading backup to IPFS..."
        
        local cid=$(curl -s -X POST -F "file=@$BACKUP_DIR/$backup_file.gz" \
            "http://localhost:5001/api/v0/add" | jq -r '.Hash')
        
        if [ -n "$cid" ] && [ "$cid" != "null" ]; then
            echo -e "${GREEN}✅ Backup uploaded to IPFS: $cid${NC}"
            echo "$cid" > "$BACKUP_DIR/${backup_file}.cid"
            
            # Pin the backup
            curl -s -X POST "http://localhost:5001/api/v0/pin/add?arg=$cid" > /dev/null
            echo -e "${GREEN}✅ Backup pinned on IPFS${NC}"
        else
            echo -e "${YELLOW}⚠️ IPFS upload failed${NC}"
        fi
    fi
}

clean_old_backups() {
    echo "🧹 Cleaning up old backups..."
    
    find "$BACKUP_DIR" -name "*.sql" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "*.cid" -mtime +$RETENTION_DAYS -delete
    
    echo -e "${GREEN}✅ Old backups cleaned (older than $RETENTION_DAYS days)${NC}"
}

verify_backup() {
    local backup_file="$1"
    
    echo "🔍 Verifying backup integrity..."
    
    if [ -f "$BACKUP_DIR/$backup_file.gz" ]; then
        # Test decompression
        if gzip -t "$BACKUP_DIR/$backup_file.gz"; then
            echo -e "${GREEN}✅ Backup integrity verified${NC}"
            return 0
        else
            echo -e "${RED}❌ Backup integrity check failed${NC}"
            return 1
        fi
    fi
}

main() {
    echo "🚀 Starting AfriVerse Database Backup"
    echo "====================================="
    
    create_backup_dir
    
    # Try Docker backup first, then Kubernetes
    if ! backup_docker; then
        echo -e "${YELLOW}⚠️ Falling back to Kubernetes backup${NC}"
        backup_k8s
        BACKUP_FILE="k8s_$BACKUP_FILE"
    fi
    
    if [ -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
        compress_backup "$BACKUP_FILE"
        verify_backup "$BACKUP_FILE.gz"
        upload_to_ipfs "$BACKUP_FILE.gz"
        clean_old_backups
        
        echo ""
        echo -e "${GREEN}🎉 Backup completed successfully!${NC}"
        echo "📁 Backup location: $BACKUP_DIR/$BACKUP_FILE.gz"
        if [ -f "$BACKUP_DIR/${BACKUP_FILE}.cid" ]; then
            echo "🌐 IPFS CID: $(cat "$BACKUP_DIR/${BACKUP_FILE}.cid")"
        fi
    else
        echo -e "${RED}❌ Backup creation failed${NC}"
        exit 1
    fi
}

# Run main function
main "$@"