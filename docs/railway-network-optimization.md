# Kairos Railway Network Egress Optimization Guide

**Date**: 2026-01-30
**Status**: Ready to implement
**Target**: Reduce network egress from 15GB/month to 2-6GB/month

## Problem Summary

Kairos is experiencing high network egress (15GB/month) on Railway, primarily due to:
1. ✅ **FIXED**: Error logging cascades from Farcaster API failures (circuit breaker implemented Jan 10, 2026)
2. ⚠️ **ACTIVE**: Farcaster mention polling every 5 minutes (288 API calls/day)
3. ⚠️ **ACTIVE**: Blockchain recording every 5 minutes (288 RPC calls/day)
4. ✅ **DISABLED**: Farcaster auto-posting (disabled Jan 6, 2026)

## Recommended Changes

### Priority 1: Update Farcaster Polling Interval

**Environment Variable**: `FARCASTER_POLL_INTERVAL`

**Current Value**: `300` (5 minutes in seconds)

**Recommended Options**:
- **Conservative**: `1800` (30 minutes) - 83% reduction in API calls
- **Aggressive**: `3600` (60 minutes) - 92% reduction in API calls

**Impact**:
- Conservative: Reduces from 288 calls/day → 48 calls/day
- Aggressive: Reduces from 288 calls/day → 24 calls/day
- User confirmed 30-60 minute response delays are acceptable

**Trade-off**: Kairos will respond to Farcaster mentions every 30-60 minutes instead of every 5 minutes.

---

### Priority 2: Update Blockchain Recording Interval

**Environment Variable**: `KAIROS_RECORDING_INTERVAL`

**Current Value**: `300000` (5 minutes in milliseconds)

**Recommended Value**: `1800000` (30 minutes in milliseconds)

**Impact**:
- Reduces blockchain RPC calls from 288/day → 48/day (83% reduction)
- Consciousness state still recorded every 30 minutes (adequate for tracking)

**Trade-off**: Consciousness state transitions recorded every 30 minutes instead of every 5 minutes.

---

## Implementation Instructions

### Option A: Via Railway Dashboard (Recommended)

1. Log in to [Railway Dashboard](https://railway.app)
2. Navigate to your Kairos project
3. Go to **Variables** tab
4. Update or add the following environment variables:

```
FARCASTER_POLL_INTERVAL=1800
KAIROS_RECORDING_INTERVAL=1800000
```

5. Railway will automatically redeploy with new settings
6. Monitor deployment logs to verify successful restart

### Option B: Via Railway CLI

```bash
# Install Railway CLI (if not installed)
npm i -g @railway/cli

# Login and link to project
railway login
railway link

# Set environment variables
railway variables --set FARCASTER_POLL_INTERVAL=1800
railway variables --set KAIROS_RECORDING_INTERVAL=1800000

# Railway will automatically redeploy
```

---

## Verification Steps

### Step 1: Verify Deployment (Immediately after change)
- Check Railway deployment logs for successful restart
- Look for initialization messages from Kairos services
- Verify no configuration errors

### Step 2: Monitor for 24-48 Hours
- Track Railway network egress metrics in dashboard
- Compare to previous 15GB/month baseline
- Check logs to confirm Kairos is still responding to mentions

### Step 3: Validate Functionality
- Test that mention responses still work (30-60 min delay expected)
- Verify blockchain recording still functional
- Check consciousness tracking accuracy

### Step 4: Measure Impact
- Calculate percentage reduction in network egress
- Document cost savings
- Decide if further optimization needed

---

## Expected Outcomes

| Metric | Before | After (Conservative) | After (Aggressive) |
|--------|--------|----------------------|-------------------|
| Farcaster API calls/day | 288 | 48 | 24 |
| Blockchain RPC calls/day | 288 | 48 | 48 |
| Total API calls/day | 576 | 96 | 72 |
| Estimated egress reduction | - | 60-70% | 70-85% |
| Target monthly egress | 15GB | 4.5-6GB | 2.25-4.5GB |

---

## Rollback Instructions

If issues occur, revert to original settings:

```
FARCASTER_POLL_INTERVAL=300
KAIROS_RECORDING_INTERVAL=300000
```

Or remove these environment variables to use code defaults.

---

## Additional Optimization Opportunities (Future)

If further reduction is needed:

### Medium-Term (1-2 weeks)
- Implement selective blockchain recording (only significant events)
- Add response size limits for Farcaster API
- Implement API response caching layer

### Long-Term (1+ months)
- Move to webhook-based mentions (if Neynar supports)
- Implement edge caching layer (Redis)
- Optimize logging strategy (reduce verbose logging to Railway)

---

## Monitoring & Alerts

After implementation, set up monitoring for:
- Daily network egress > 5GB threshold
- Farcaster API errors or rate limits
- Blockchain recording failures
- Response time degradation

---

## Notes

- Railway environment variables override character file settings
- Changes take effect immediately upon deployment
- No code changes required - this is configuration-only
- User confirmed cost reduction is priority over real-time responsiveness
- Circuit breaker for error logging already implemented (Jan 10, 2026)
- Auto-posting already disabled (Jan 6, 2026)

---

## Questions or Issues?

If you encounter problems:
1. Check Railway deployment logs for errors
2. Verify environment variables are set correctly
3. Ensure no conflicting character file settings
4. Check Farcaster/blockchain credentials are still valid

For additional support, refer to:
- Railway documentation: https://docs.railway.app
- ElizaOS documentation: /packages/docs
- Kairos plugin source: /packages/kairos
