# Railway Farcaster Configuration for Kairos

This document details the required Railway environment variables for the Kairos AI agent's Farcaster integration.

## Required Environment Variables

### Core API Keys
```bash
ANTHROPIC_API_KEY=<your_anthropic_api_key>
OPENAI_API_KEY=<your_openai_api_key>
```

### Farcaster Credentials
```bash
FARCASTER_FID=1366565
FARCASTER_NEYNAR_API_KEY=AA3288FC-0BA2-49EA-81DB-CC638828DA1D
FARCASTER_SIGNER_UUID=8cfbce46-c088-4fc0-beea-d34d658f7a82
```

### Farcaster Casting Configuration
```bash
ENABLE_CAST=true
CAST_INTERVAL_MIN=120
CAST_INTERVAL_MAX=300
CAST_IMMEDIATELY=true
ENABLE_ACTION_PROCESSING=true
ACTION_INTERVAL=600
MAX_ACTIONS_PROCESSING=1
```

## Important Notes

1. **Environment Variable Names**: The Farcaster plugin requires `CAST_INTERVAL_MIN` and `CAST_INTERVAL_MAX` (not `POST_INTERVAL_MIN`/`POST_INTERVAL_MAX`).

2. **Anthropic API Key**: The plugin uses `ModelType.TEXT_SMALL` which defaults to `claude-3-haiku-20240307`. Ensure `ANTHROPIC_API_KEY` is set in Railway to prevent authentication errors during periodic interactions.

3. **Runtime Settings Priority**: The ElizaOS runtime loads settings in this order:
   - `character.secrets`
   - `character.settings`
   - `runtime.settings` (environment variables)

4. **Local Testing Limitation**: Local `.env` file loading has known issues in the development environment. Configuration should be verified directly in Railway's environment variable settings.

## Verification

After deploying to Railway with these variables:

1. Check logs for successful Farcaster initialization:
   ```
   FID: ✓ 1366565
   Signer UUID: ✓ 8cfbce46-****
   API Key: ✓ AA32****
   ```

2. Monitor for autonomous casting activity within the configured interval (120-300 seconds)

3. Verify no Anthropic API authentication errors during periodic interactions

## Troubleshooting

- If posts aren't occurring: Verify `ENABLE_CAST=true` and `FARCASTER_SIGNER_UUID` is correct
- If API errors occur: Check `ANTHROPIC_API_KEY` is set and valid
- If intervals seem wrong: Confirm `CAST_INTERVAL_MIN`/`MAX` (not `POST_INTERVAL_MIN`/`MAX`)
