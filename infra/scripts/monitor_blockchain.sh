#!/bin/bash

set -e

echo "⛓️ AfriVerse Blockchain Monitor"

# Configuration
CONTRACT_ADDRESS="${CONTRACT_ADDRESS}"
RPC_URL="${RPC_URL:-https://rpc.testnet.linea.xyz}"
SCAN_URL="https://goerli.lineascan.build"
CHECK_INTERVAL=60

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

get_block_number() {
    curl -s -X POST \
        -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        "$RPC_URL" | jq -r '.result' | xargs printf "%d"
}

get_contract_events() {
    local from_block="$1"
    local to_block="$2"
    
    # This would require the contract ABI and more complex setup
    # For now, we'll just show recent blocks
    echo "📊 Blocks $from_block to $to_block"
}

get_gas_price() {
    curl -s -X POST \
        -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}' \
        "$RPC_URL" | jq -r '.result' | xargs printf "%d"
}

get_network_info() {
    local chain_id=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
        "$RPC_URL" | jq -r '.result')
    
    case $chain_id in
        "0xe704")
            echo "Linea Testnet"
            ;;
        "0xaa36a7")
            echo "Ethereum Testnet"
            ;;
        *)
            echo "Unknown Network (Chain ID: $chain_id)"
            ;;
    esac
}

check_contract() {
    if [ -n "$CONTRACT_ADDRESS" ]; then
        echo "🔍 Checking contract: $CONTRACT_ADDRESS"
        
        # Get contract code
        local code=$(curl -s -X POST \
            -H "Content-Type: application/json" \
            --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getCode\",\"params\":[\"$CONTRACT_ADDRESS\", \"latest\"],\"id\":1}" \
            "$RPC_URL" | jq -r '.result')
        
        if [ "$code" != "0x" ]; then
            echo -e "${GREEN}✅ Contract is deployed${NC}"
            echo "🌐 Explorer: $SCAN_URL/address/$CONTRACT_ADDRESS"
        else
            echo -e "${RED}❌ Contract not found at address${NC}"
        fi
    fi
}

monitor_loop() {
    local last_block=0
    
    echo "🔍 Starting blockchain monitor (Ctrl+C to stop)"
    echo "=============================================="
    
    while true; do
        local current_block=$(get_block_number)
        local gas_price=$(get_gas_price)
        local network=$(get_network_info)
        
        clear
        echo -e "${BLUE}⛓️ AfriVerse Blockchain Monitor${NC}"
        echo "=============================================="
        echo "🌐 Network: $network"
        echo "📦 Current Block: $current_block"
        echo "⛽ Gas Price: $(echo "scale=2; $gas_price / 1000000000" | bc) Gwei"
        
        if [ "$last_block" -ne 0 ] && [ "$current_block" -gt "$last_block" ]; then
            local new_blocks=$((current_block - last_block))
            echo -e "${GREEN}🆕 $new_blocks new block(s) since last check${NC}"
            
            # Show events from new blocks
            get_contract_events "$last_block" "$current_block"
        fi
        
        check_contract
        
        last_block=$current_block
        echo ""
        echo "⏳ Next update in ${CHECK_INTERVAL}s..."
        sleep $CHECK_INTERVAL
    done
}

main() {
    case "${1:-}" in
        "monitor")
            monitor_loop
            ;;
        "status")
            echo -e "${BLUE}⛓️ Blockchain Status${NC}"
            echo "===================="
            echo "🌐 Network: $(get_network_info)"
            echo "📦 Block: $(get_block_number)"
            echo "⛽ Gas Price: $(echo "scale=2; $(get_gas_price) / 1000000000" | bc) Gwei"
            check_contract
            ;;
        "contract")
            if [ -z "$CONTRACT_ADDRESS" ]; then
                echo -e "${RED}❌ CONTRACT_ADDRESS not set${NC}"
                exit 1
            fi
            check_contract
            ;;
        *)
            echo "Usage: $0 {monitor|status|contract}"
            echo ""
            echo "  monitor   - Continuously monitor blockchain activity"
            echo "  status    - Show current blockchain status"
            echo "  contract  - Check contract deployment status"
            exit 1
            ;;
    esac
}

main "$@"