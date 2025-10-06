# Railway Environment Variables Checklist for Kairos

This checklist contains all environment variables needed to run Kairos on Railway.

**Important:** In Railway, use the "Share to all services" option so all packages can access these variables.

---

## ✅ Required - AI Model Providers

At least ONE of these is required for the LLM to work:

```bash
# Anthropic (recommended for Kairos - uses Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# OpenAI (for embeddings - recommended)
OPENAI_API_KEY=your_openai_api_key_here

# Google (optional alternative)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
```

---

## ✅ Required - Blockchain (Kairos Consciousness Recording)

```bash
# Base Sepolia RPC - Use Infura or Alchemy for reliability
BASE_SEPOLIA_RPC_URL=https://base-sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Wallet Private Key (Railway encrypts this)
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix

# Contract Addresses (already deployed on Base Sepolia)
KAIROS_CONSCIOUSNESS_CONTRACT_ADDRESS=0xC7bab79Eb797B097bF59C0b2e2CF02Ea9F4D4dB8
KAIROS_INTERACTION_CONTRACT_ADDRESS=0x0B9b103B6F8B8388deD828a2fe973b43E20f6577

# Session ID
KAIROS_SESSION_ID=0xea9b69a814606a8f4a435ac8e8348419a3834dcafcd0e7e92d7bb8109e27c2ea

# Enable blockchain recording
KAIROS_ENABLE_BLOCKCHAIN_RECORDING=true
```

---

## ✅ Required - Farcaster Integration

```bash
# Your Farcaster credentials
FARCASTER_FID=your_farcaster_user_id
FARCASTER_PRIVATE_KEY=your_farcaster_account_private_key

# Farcaster Hub
FARCASTER_HUB_URL=https://hub.farcaster.xyz

# Channels to monitor and post in
FARCASTER_CHANNELS=/philosophy,/ai,/consciousness

# Posting behavior
FARCASTER_AUTO_POSTING=true
FARCASTER_MENTION_MONITORING=true

# Frames (interactive posts)
FARCASTER_FRAMES_ENABLED=true
FARCASTER_FRAME_BASE_URL=https://YOUR_RAILWAY_APP_NAME.up.railway.app
```

**Note:** Replace `YOUR_RAILWAY_APP_NAME` with your actual Railway deployment URL after first deploy.

---

## ⚙️ Optional - Production Settings

```bash
# Server configuration
SERVER_PORT=3000
NODE_ENV=production

# Database (for persistence - requires Railway volume)
PGLITE_DATA_DIR=/app/.eliza/.elizadb

# Disable UI in production (optional)
ELIZA_UI_ENABLE=false
```

---

## 🔧 Optional - Kairos Advanced Configuration

```bash
# Gas and performance tuning
KAIROS_MAX_GAS_PRICE=3
KAIROS_GAS_LIMIT=300000
KAIROS_ENABLE_DYNAMIC_GAS=true
KAIROS_MIN_BALANCE_THRESHOLD=0.005

# Recording intervals
KAIROS_RECORDING_INTERVAL=300000
KAIROS_RECORDING_MODE=production

# Rate limiting
KAIROS_CLIENT_RATE_LIMIT_MS=120000
```

---

## 📦 Optional - Additional Services

```bash
# IPFS for consciousness context data (optional)
IPFS_GATEWAY_URL=https://ipfs.io/ipfs/
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Discord/Telegram alerts (optional)
DISCORD_WEBHOOK_URL=your_discord_webhook_url
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Basescan API (optional - for contract verification)
BASESCAN_API_KEY=your_basescan_api_key
```

---

## 🚀 Railway Setup Steps

1. **In Railway Dashboard → Variables:**
   - Click "New Variable"
   - Add each variable from the "Required" sections above
   - Choose "Share to all services" when prompted
   - Railway automatically encrypts sensitive values like private keys

2. **After First Deployment:**
   - Get your Railway app URL (e.g., `https://kairos-production.up.railway.app`)
   - Update `FARCASTER_FRAME_BASE_URL` with this URL
   - Railway will auto-redeploy with the new value

3. **Optional - Database Persistence:**
   - In Railway → Your Service → Data
   - Add a Volume mounted at `/app/.eliza/.elizadb`
   - This persists the PGLite database across restarts

---

## ✅ Secrets Removed from kairos.json

The following were removed from `characters/kairos.json` for security:

- `PRIVATE_KEY` - Now Railway environment variable only
- `BASE_SEPOLIA_RPC_URL` - Now Railway environment variable only
- `FARCASTER_FID` - Now Railway environment variable only
- `FARCASTER_PRIVATE_KEY` - Now Railway environment variable only
- `FARCASTER_FRAME_BASE_URL` - Now Railway environment variable only

These will be loaded from Railway's encrypted environment variables instead.

---

## 🔍 Verification

After deployment, check Railway logs for:

```
✓ Anthropic/OpenAI API key loaded
✓ Blockchain service initialized
✓ Farcaster client connected
✓ Consciousness contracts loaded
✓ Server listening on port 3000
```

If any services fail to initialize, check that the corresponding environment variables are set correctly.
