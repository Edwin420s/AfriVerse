#!/bin/bash

set -e

echo "📌 IPFS Pinning Service Script"

# Configuration
IPFS_API="${IPFS_API:-http://localhost:5001}"
PINATA_API_KEY="${PINATA_API_KEY}"
PINATA_SECRET_API_KEY="${PINATA_SECRET_API_KEY}"
MAX_RETRIES=3
RETRY_DELAY=5

pin_to_local_ipfs() {
    local file_path="$1"
    local name="$2"
    
    echo "📤 Pinning $name to local IPFS node..."
    
    for i in $(seq 1 $MAX_RETRIES); do
        if curl -s -X POST -F "file=@$file_path" -F "pin=true" "$IPFS_API/api/v0/add" > response.json; then
            local cid=$(jq -r '.Hash' response.json)
            if [ "$cid" != "null" ]; then
                echo "✅ Successfully pinned to local IPFS: $cid"
                echo "$cid" > "ipfs_cid_$name.txt"
                rm -f response.json
                return 0
            fi
        fi
        
        if [ $i -lt $MAX_RETRIES ]; then
            echo "⚠️ Attempt $i failed. Retrying in $RETRY_DELAY seconds..."
            sleep $RETRY_DELAY
        fi
    done
    
    echo "❌ Failed to pin to local IPFS after $MAX_RETRIES attempts"
    rm -f response.json
    return 1
}

pin_to_pinata() {
    local file_path="$1"
    local name="$2"
    
    if [ -z "$PINATA_API_KEY" ] || [ -z "$PINATA_SECRET_API_KEY" ]; then
        echo "⚠️ Pinata credentials not set. Skipping remote pinning."
        return 0
    fi
    
    echo "📤 Pinning $name to Pinata..."
    
    for i in $(seq 1 $MAX_RETRIES); do
        if curl -s -X POST \
            -H "pinata_api_key: $PINATA_API_KEY" \
            -H "pinata_secret_api_key: $PINATA_SECRET_API_KEY" \
            -F "file=@$file_path" \
            -F "pinataMetadata={\"name\":\"$name\"}" \
            "https://api.pinata.cloud/pinning/pinFileToIPFS" > response.json; then
            
            local cid=$(jq -r '.IpfsHash' response.json)
            if [ "$cid" != "null" ]; then
                echo "✅ Successfully pinned to Pinata: $cid"
                rm -f response.json
                return 0
            fi
        fi
        
        if [ $i -lt $MAX_RETRIES ]; then
            echo "⚠️ Attempt $i failed. Retrying in $RETRY_DELAY seconds..."
            sleep $RETRY_DELAY
        fi
    done
    
    echo "❌ Failed to pin to Pinata after $MAX_RETRIES attempts"
    rm -f response.json
    return 1
}

unpin_from_ipfs() {
    local cid="$1"
    
    echo "🗑️ Unpinning $cid from local IPFS..."
    curl -s -X POST "$IPFS_API/api/v0/pin/rm?arg=$cid" > /dev/null || true
}

# Main execution
case "${1:-}" in
    "pin")
        if [ $# -lt 3 ]; then
            echo "Usage: $0 pin <file_path> <name>"
            exit 1
        fi
        pin_to_local_ipfs "$2" "$3"
        pin_to_pinata "$2" "$3"
        ;;
    "unpin")
        if [ $# -lt 2 ]; then
            echo "Usage: $0 unpin <cid>"
            exit 1
        fi
        unpin_from_ipfs "$2"
        ;;
    "status")
        echo "🔍 Checking IPFS node status..."
        curl -s "$IPFS_API/api/v0/id" | jq '.' || echo "❌ IPFS node not reachable"
        ;;
    *)
        echo "Usage: $0 {pin|unpin|status}"
        echo "  pin <file_path> <name>    - Pin file to IPFS"
        echo "  unpin <cid>               - Unpin file from IPFS"
        echo "  status                    - Check IPFS node status"
        exit 1
        ;;
esac