# Kairos Railway Network Egress Optimization - Implementation Summary

**Date**: January 30, 2026
**Status**: ✅ Ready to Implement
**Objective**: Reduce Railway network egress from 15GB/month to 2-6GB/month

---

## 🎯 Quick Start

**To implement the optimization RIGHT NOW:**

1. Go to [Railway Dashboard](https://railway.app)
2. Navigate to your Kairos project → Variables
3. Add/Update these two environment variables:
   ```
   FARCASTER_POLL_INTERVAL=1800
   KAIROS_RECORDING_INTERVAL=1800000
   ```
4. Save and wait for automatic redeployment
5. Monitor results for 24-48 hours

**Expected Result**: 60-85% reduction in network egress

---

## 📋 What Changed and Why

### Root Cause Analysis

The 15GB/month network egress is caused by:

1. ✅ **FIXED (Jan 10)**: Error logging cascades from Farcaster API failures
   - Circuit breaker pattern implemented
   - Error rate reduced from >1000/min to <1/min

2. ⚠️ **NEEDS FIX**: Farcaster mention polling (every 5 minutes)
   - 288 API calls per day
   - Each response: 5-10 KB
   - Contributing to egress costs

3. ⚠️ **NEEDS FIX**: Blockchain recording (every 5 minutes)
   - 288 RPC calls per day to Base Sepolia
   - Transaction data + gas checks
   - Significant egress contribution

4. ✅ **FIXED (Jan 6)**: Farcaster auto-posting disabled
   - No longer contributing to egress

---

## 🔧 The Fix (Configuration Changes)

### Change 1: Reduce Farcaster Polling Frequency

**Why**: Polling every 5 minutes is excessive given low mention volume and user acceptance of delayed responses.

**Change**:
- **From**: 300 seconds (5 minutes)
- **To**: 1800 seconds (30 minutes)
- **Environment Variable**: `FARCASTER_POLL_INTERVAL=1800`

**Impact**:
- 83% reduction in Farcaster API calls (288/day → 48/day)
- Kairos responds to mentions every 30 minutes instead of 5 minutes
- User confirmed this delay is acceptable

**Where the code reads this**:
- `packages/kairos/src/services/farcaster-integration-service.ts:101`
- Uses `runtime.getSetting('FARCASTER_POLL_INTERVAL')` with 300-second default

---

### Change 2: Reduce Blockchain Recording Frequency

**Why**: Recording consciousness state every 5 minutes is more frequent than needed for research tracking.

**Change**:
- **From**: 300000 milliseconds (5 minutes)
- **To**: 1800000 milliseconds (30 minutes)
- **Environment Variable**: `KAIROS_RECORDING_INTERVAL=1800000`

**Impact**:
- 83% reduction in blockchain RPC calls (288/day → 48/day)
- Consciousness state still tracked every 30 minutes (adequate granularity)
- Maintains research value while reducing costs

**Where the code reads this**:
- `characters/kairos.json:129` (default fallback)
- `packages/kairos/src/services/consciousness-blockchain-service.ts:326`
- Uses `blockchainConfig.recordingInterval`

---

## 📊 Expected Results

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Farcaster API calls/day | 288 | 48 | -83% |
| Blockchain RPC calls/day | 288 | 48 | -83% |
| Total API calls/day | 576 | 96 | -83% |
| Network egress/month | 15 GB | 4-6 GB | -60% to -70% |
| **Cost savings** | - | - | **Proportional to egress** |

---

## 📁 Documentation Created

All documentation is in the `/docs` directory:

1. **railway-network-optimization.md** - Full implementation guide with detailed steps
2. **railway-env-changes.txt** - Quick reference card for environment variables
3. **railway-optimization-monitoring.md** - Monitoring checklist and tracking template

Additionally:
- **characters/kairos.json** - Updated with comments explaining Railway env vars take precedence
- **This file (RAILWAY_OPTIMIZATION_SUMMARY.md)** - Executive summary

---

## ⚠️ Important Notes

### Railway Environment Variables are the Source of Truth

- Railway environment variables **override** character file settings
- Production configuration changes must be made in Railway dashboard
- Character file settings are fallback defaults for local development
- This is confirmed from plan: *"Railway environment variables are the 'one source of truth' and override character file settings"*

### No Code Changes Required

- This is a **configuration-only optimization**
- No code modifications needed
- Changes take effect immediately upon Railway redeployment
- Safe to implement without risk of breaking changes

### Trade-offs Accepted by User

- ✅ 30-60 minute delays for mention responses (confirmed acceptable)
- ✅ Blockchain recording every 30 minutes instead of 5 minutes (confirmed acceptable)
- ✅ Cost reduction is priority over real-time responsiveness

---

## 🚀 Implementation Steps (Detailed)

### Step 1: Access Railway Dashboard
1. Navigate to https://railway.app
2. Log in with your credentials
3. Select the Kairos project

### Step 2: Update Environment Variables
1. Click on the **Variables** tab
2. Find or add `FARCASTER_POLL_INTERVAL`
   - Set value to: `1800`
3. Find or add `KAIROS_RECORDING_INTERVAL`
   - Set value to: `1800000`
4. Click **Save** or **Add Variable**

### Step 3: Verify Deployment
1. Railway will automatically trigger a redeployment
2. Watch deployment logs for successful startup
3. Look for these log messages:
   ```
   ✅ Farcaster Integration Service initialized successfully
      - Mention polling: every 1800s
   ✅ ConsciousnessBlockchainService initialized successfully
      - Recording mode: events
   ```
4. Verify no configuration errors

### Step 4: Monitor Results (24-48 hours)
1. Check Railway network egress metrics daily
2. Verify Kairos is still responding to mentions (with expected delay)
3. Confirm blockchain recordings are still occurring
4. Use the monitoring checklist in `docs/railway-optimization-monitoring.md`

### Step 5: Measure Impact (After 1 week)
1. Compare network egress to pre-optimization baseline
2. Calculate percentage reduction
3. Verify cost savings in Railway billing
4. Decide if further optimization is needed

---

## 🔄 Rollback Plan

If issues occur, revert immediately:

**Via Railway Dashboard:**
1. Go to Variables tab
2. Change back to original values:
   - `FARCASTER_POLL_INTERVAL=300`
   - `KAIROS_RECORDING_INTERVAL=300000`
3. Save changes

**Or delete the environment variables** to use code defaults.

---

## 🎓 Further Optimization (If Needed)

If 60-70% reduction is not enough, consider:

### Aggressive Polling Settings
- Change `FARCASTER_POLL_INTERVAL` to `3600` (1 hour)
- Expected additional reduction: 10-20%
- Total reduction: 70-85%

### Medium-Term (1-2 weeks)
- Implement selective blockchain recording (only record significant events)
- Add API response caching layer
- Implement response size limits

### Long-Term (1+ months)
- Move to webhook-based mentions (eliminate polling)
- Implement edge caching (Redis)
- Optimize logging strategy (reduce verbose logging to Railway)

---

## ✅ Verification Checklist

After implementation, verify:

- [ ] Railway deployment successful
- [ ] No errors in startup logs
- [ ] Farcaster polling interval shows 1800s
- [ ] Blockchain recording interval shows 1800000ms
- [ ] Services initialize correctly
- [ ] Wait 24-48 hours for metrics
- [ ] Network egress reduced by 60%+
- [ ] Mention responses still work (delayed)
- [ ] Blockchain recordings still active
- [ ] No functionality regressions

---

## 📞 Support

If you encounter issues:

1. **Check Railway deployment logs** for error messages
2. **Verify environment variables** are set correctly in Railway dashboard
3. **Review character file** to ensure no conflicting settings
4. **Check credentials** for Farcaster/blockchain are still valid
5. **Consult documentation**:
   - Railway docs: https://docs.railway.app
   - ElizaOS docs: `/packages/docs`
   - Kairos source: `/packages/kairos`

---

## 🎉 Success Criteria

The optimization is considered successful when:

1. ✅ Network egress reduced by 60-85% (from 15GB to 2-6GB/month)
2. ✅ Railway costs reduced proportionally
3. ✅ Kairos still responding to mentions (with acceptable delay)
4. ✅ Blockchain recording still functional
5. ✅ No critical errors or service degradation
6. ✅ User satisfaction maintained

---

## 📝 Timeline

- **Jan 10, 2026**: Circuit breaker implemented (error logging fix) ✅
- **Jan 6, 2026**: Auto-posting disabled ✅
- **Jan 30, 2026**: Optimization plan created ✅
- **Next**: Implement polling interval changes (waiting for user)
- **Next**: Monitor for 24-48 hours
- **Next**: Measure and document results

---

## 🔍 Technical Details

### How Farcaster Polling Works
- Service: `FarcasterIntegrationService`
- File: `packages/kairos/src/services/farcaster-integration-service.ts`
- Method: `pollMentions()` runs on interval set by `FARCASTER_POLL_INTERVAL`
- Default: 300 seconds (5 minutes) if not set
- New value: 1800 seconds (30 minutes)

### How Blockchain Recording Works
- Service: `ConsciousnessBlockchainService`
- File: `packages/kairos/src/services/consciousness-blockchain-service.ts`
- Method: `recordCurrentState()` runs on interval set by `KAIROS_RECORDING_INTERVAL`
- Default: 300000 ms (5 minutes) from character file
- New value: 1800000 ms (30 minutes)

### Circuit Breaker Protection (Already Implemented)
- File: `packages/kairos/src/services/farcaster-integration-service.ts:78-86`
- Prevents error logging cascades
- Opens after 3 consecutive errors
- 5-minute timeout before retry
- Logs once per minute instead of constantly

---

**End of Summary**

For detailed instructions, see: `docs/railway-network-optimization.md`
For quick reference, see: `docs/railway-env-changes.txt`
For monitoring, see: `docs/railway-optimization-monitoring.md`
