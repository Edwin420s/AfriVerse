# Network Connection Troubleshooting Guide

## Quick Fix Steps

### Step 1: Test Network Connection

Run this command first to diagnose the issue:

```bash
npm run test:network
```

This will check:
- ✅ RPC connectivity
- ✅ Network detection
- ✅ Your account balance
- ✅ Gas prices

### Step 2: Try Alternative RPC Endpoint

If the default RPC fails, try the alternative BlockPI endpoint:

```bash
# Test alternative network
npm run test:network:alt

# Deploy using alternative network
npm run deploy:testnet:alt
```

---

## Common Errors & Solutions

### Error: "could not detect network"

**Cause:** The public RPC endpoint is not responding or is rate-limited

**Solutions:**

#### Option 1: Try Alternative RPC (Fastest)
```bash
npm run deploy:testnet:alt
```

#### Option 2: Use Infura (Recommended for Production)

1. Sign up for free at: https://infura.io/
2. Create a new API key
3. Update your `.env` file:
   ```env
   LINEA_TESTNET_RPC=https://linea-sepolia.infura.io/v3/YOUR_API_KEY
   ```
4. Deploy:
   ```bash
   npm run deploy:testnet
   ```

#### Option 3: Use Alchemy

1. Sign up at: https://www.alchemy.com/
2. Create Linea Sepolia app
3. Get your RPC URL
4. Update `.env`:
   ```env
   LINEA_TESTNET_RPC=https://linea-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   ```

#### Option 4: Wait and Retry

Public RPCs can be temporarily unavailable. Wait 5-10 minutes and try again:
```bash
npm run deploy:testnet
```

---

### Error: "insufficient funds for gas"

**Cause:** Your wallet doesn't have enough testnet ETH

**Solution:**

1. Check your balance:
   ```bash
   npm run test:network
   ```

2. Get testnet ETH:
   - **Linea Faucet:** https://faucet.linea.build/
   - **Sepolia Faucet:** https://sepoliafaucet.com/
   - Then bridge to Linea: https://bridge.linea.build/

3. Verify you received the funds (wait 1-2 minutes):
   ```bash
   npm run test:network
   ```

---

### Error: "nonce too low" or "nonce has already been used"

**Cause:** Transaction nonce mismatch

**Solution:**

Reset your account nonce in MetaMask:
1. Open MetaMask
2. Settings → Advanced
3. Click "Reset Account"
4. Try deployment again

---

### Error: "network timeout"

**Cause:** RPC endpoint is slow or blocked

**Solutions:**

1. **Increase timeout** (already done in config)
2. **Check internet connection**
3. **Try alternative RPC:**
   ```bash
   npm run deploy:testnet:alt
   ```
4. **Check firewall/VPN settings**

---

## Available RPC Endpoints

### Default (Official Linea)
```
https://rpc.sepolia.linea.build
```
- Free
- May have rate limits
- Public endpoint

### Alternative (BlockPI)
```
https://linea-sepolia.blockpi.network/v1/rpc/public
```
- Free
- Public endpoint
- Often more reliable

### Infura (Recommended)
```
https://linea-sepolia.infura.io/v3/YOUR_API_KEY
```
- Free tier available
- More reliable
- Better for production
- Sign up: https://infura.io/

### Alchemy
```
https://linea-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```
- Free tier available
- Great developer tools
- Sign up: https://alchemy.com/

---

## Diagnostic Commands

### Test Network Connection
```bash
# Test default RPC
npm run test:network

# Test alternative RPC
npm run test:network:alt
```

### Check Service Status
- Linea Status: https://linea.statuspage.io/
- Check if testnet is experiencing issues

### Manual RPC Test
You can test the RPC manually:

```bash
curl -X POST https://rpc.sepolia.linea.build \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

Expected response:
```json
{"jsonrpc":"2.0","id":1,"result":"0xe705"}
```
(0xe705 = 59141 in decimal)

---

## Configuration Files

### hardhat.config.js Networks

The config includes multiple network options:

1. **lineaTestnet** (default) - Official Linea RPC
2. **lineaSepoliaAlt** - BlockPI alternative
3. **localhost** - For local testing

You can add more networks as needed.

### Environment Variables (.env)

Required:
```env
PRIVATE_KEY=your_private_key_without_0x
```

Optional (but recommended):
```env
LINEA_TESTNET_RPC=https://your-preferred-rpc-url
LINEA_SCAN_API_KEY=your_api_key_for_verification
```

---

## Deployment Flow

### Recommended Workflow

```bash
# 1. Compile contracts
npm run compile

# 2. Test network connection
npm run test:network

# 3. If network test passes, deploy
npm run deploy:testnet

# 4. If step 3 fails, try alternative RPC
npm run deploy:testnet:alt
```

---

## Still Having Issues?

### Check Logs

Look for specific error messages in the deployment output:
- Network errors → RPC issue
- Gas errors → Need more testnet ETH
- Compilation errors → Code issues

### Get Help

1. **Check Linea Status:** https://linea.statuspage.io/
2. **Linea Discord:** https://discord.gg/linea
3. **Linea Docs:** https://docs.linea.build/
4. **Support:** https://support.linea.build/

---

## Prevention Tips

### For Reliable Deployments

1. ✅ Use Infura or Alchemy RPC (not public endpoints)
2. ✅ Keep at least 0.1 testnet ETH in your wallet
3. ✅ Test network connection before deploying
4. ✅ Have a backup RPC endpoint configured
5. ✅ Monitor Linea status page before major deployments

### Security Best Practices

1. ❌ Never commit `.env` file
2. ❌ Never share your private key
3. ✅ Use separate wallets for testing
4. ✅ Keep private keys in secure password manager
5. ✅ Use hardware wallet for mainnet deployments

---

## Quick Reference

```bash
# Test network connectivity
npm run test:network

# Deploy with default RPC
npm run deploy:testnet

# Deploy with alternative RPC
npm run deploy:testnet:alt

# Check balance and network info
npm run test:network

# Compile contracts first
npm run compile
```

---

**Need more help? See DEPLOYMENT_SETUP.md for detailed setup instructions.**
