# Direct RPC Connectivity Test
# This tests RPC endpoints without Hardhat

Write-Host "🔍 Testing Linea Sepolia RPC Endpoints Directly..." -ForegroundColor Cyan
Write-Host ""

$endpoints = @(
    @{Name="Official Linea"; URL="https://rpc.sepolia.linea.build"},
    @{Name="BlockPI"; URL="https://linea-sepolia.blockpi.network/v1/rpc/public"}
)

$body = @{
    jsonrpc = "2.0"
    method = "eth_chainId"
    params = @()
    id = 1
} | ConvertTo-Json

foreach ($endpoint in $endpoints) {
    Write-Host "Testing $($endpoint.Name)..." -ForegroundColor Yellow
    Write-Host "URL: $($endpoint.URL)"
    
    try {
        $response = Invoke-RestMethod -Uri $endpoint.URL -Method Post -Body $body -ContentType "application/json" -TimeoutSec 30
        
        if ($response.result -eq "0xe705") {
            Write-Host "✅ SUCCESS - Chain ID: 59141 (0xe705)" -ForegroundColor Green
            Write-Host ""
        } else {
            Write-Host "⚠️  Unexpected response: $($response | ConvertTo-Json)" -ForegroundColor Yellow
            Write-Host ""
        }
    }
    catch {
        Write-Host "❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "📝 If all tests failed:" -ForegroundColor Cyan
Write-Host "1. Check your internet connection"
Write-Host "2. Check if firewall is blocking connections"
Write-Host "3. Try using a VPN"
Write-Host "4. Use Infura or Alchemy (more reliable)"
Write-Host ""
Write-Host "🔗 Get Infura API Key (free): https://infura.io/"
Write-Host "🔗 Get Alchemy API Key (free): https://alchemy.com/"
