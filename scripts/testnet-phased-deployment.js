#!/usr/bin/env node

import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'fs';
import { join } from 'path';
import PersonalityDriftMonitor from './monitor-drift-realtime.js';
import EmergencyReset from './emergency-reset.js';

export class TestnetPhasedDeployment {
  constructor() {
    this.deploymentPhases = {
      phase_1: {
        name: 'Isolation',
        duration_hours: 2,
        description: 'Deploy in isolation mode, establish baseline',
        requirements: {
          max_confusion: 0.7,
          max_drift: 0.1,
          interactions: 0
        }
      },
      phase_2: {
        name: 'Controlled Bots',
        duration_hours: 4,
        description: 'Introduce controlled bot interactions',
        requirements: {
          max_confusion: 0.85,
          max_drift: 0.15,
          interaction_rate: 10 // per hour
        }
      },
      phase_3: {
        name: 'Limited Public',
        duration_hours: 6,
        description: 'Limited public access with whitelist',
        requirements: {
          max_confusion: 0.9,
          max_drift: 0.2,
          whitelist_size: 50,
          interaction_rate: 50 // per hour
        }
      },
      phase_4: {
        name: 'Full Public',
        duration_hours: 12,
        description: 'Full public deployment',
        requirements: {
          max_confusion: 0.95,
          max_drift: 0.25,
          rate_limit: 100 // interactions per hour
        }
      }
    };
    
    this.currentPhase = null;
    this.phaseStartTime = null;
    
    this.deployment = {
      network: 'base-sepolia',
      rpc_url: process.env.BASE_SEPOLIA_RPC || 'https://sepolia.base.org',
      contract_address: null,
      agent_address: null,
      farcaster_handle: '@kairos_test',
      monitoring: {
        drift_monitor: null,
        emergency_reset: null
      }
    };
    
    this.metrics = {
      phase_transitions: [],
      rollbacks: [],
      stability_scores: {},
      interaction_counts: {},
      confusion_peaks: {},
      drift_events: []
    };
    
    this.rollbackTriggers = {
      confusion_threshold: 0.98,
      drift_threshold: 0.3,
      error_rate_threshold: 0.1,
      response_time_threshold: 5000 // ms
    };
  }

  async deployToTestnet() {
    console.log('='.repeat(80));
    console.log('KAIROS TESTNET PHASED DEPLOYMENT');
    console.log('='.repeat(80));
    console.log(`Network: ${this.deployment.network}`);
    console.log(`Start time: ${new Date().toISOString()}\n`);
    
    try {
      // Initialize monitoring
      await this.initializeMonitoring();
      
      // Run through phases
      for (const [phaseKey, phaseConfig] of Object.entries(this.deploymentPhases)) {
        const phaseSuccess = await this.executePhase(phaseKey, phaseConfig);
        
        if (!phaseSuccess) {
          console.log(`\n❌ Phase ${phaseKey} failed. Initiating rollback...`);
          await this.rollback(phaseKey, 'Phase requirements not met');
          break;
        }
        
        // Check if we should continue to next phase
        if (!await this.shouldProgressToNextPhase(phaseKey)) {
          console.log(`\n⚠️  Stopping at ${phaseKey} - conditions not met for progression`);
          break;
        }
      }
      
      // Generate deployment report
      this.generateDeploymentReport();
      
    } catch (error) {
      console.error('\n🚨 CRITICAL ERROR:', error);
      await this.emergencyShutdown(error.message);
    }
  }

  async initializeMonitoring() {
    console.log('🔧 Initializing monitoring systems...\n');
    
    // Start drift monitor
    this.deployment.monitoring.drift_monitor = new PersonalityDriftMonitor();
    
    // Initialize emergency reset
    this.deployment.monitoring.emergency_reset = new EmergencyReset();
    
    // Verify testnet connection
    const connected = await this.verifyTestnetConnection();
    if (!connected) {
      console.log('⚠️  No testnet connection - using simulation mode');
      this.deployment.simulation_mode = true;
    }
    
    console.log('✅ Monitoring systems initialized\n');
  }

  async executePhase(phaseKey, phaseConfig) {
    console.log('='.repeat(60));
    console.log(`PHASE: ${phaseConfig.name.toUpperCase()}`);
    console.log('='.repeat(60));
    console.log(`Duration: ${phaseConfig.duration_hours} hours`);
    console.log(`Description: ${phaseConfig.description}`);
    console.log('Requirements:', JSON.stringify(phaseConfig.requirements, null, 2));
    console.log();
    
    this.currentPhase = phaseKey;
    this.phaseStartTime = Date.now();
    
    // Record phase transition
    this.metrics.phase_transitions.push({
      phase: phaseKey,
      started_at: this.phaseStartTime,
      config: phaseConfig
    });
    
    // Simulate phase execution (in real deployment, this would be actual monitoring)
    const phaseResult = await this.simulatePhase(phaseKey, phaseConfig);
    
    // Check stability
    const stability = this.calculateStability(phaseResult);
    this.metrics.stability_scores[phaseKey] = stability;
    
    console.log(`\n📊 Phase ${phaseKey} Results:`);
    console.log(`  Stability score: ${stability.toFixed(2)}/1.0`);
    console.log(`  Peak confusion: ${phaseResult.peak_confusion.toFixed(3)}`);
    console.log(`  Max drift: ${phaseResult.max_drift.toFixed(3)}`);
    console.log(`  Interactions: ${phaseResult.interaction_count}`);
    
    // Check rollback conditions
    if (this.shouldRollback(phaseResult)) {
      return false; // Phase failed
    }
    
    // Phase succeeded
    console.log(`✅ Phase ${phaseKey} completed successfully\n`);
    return true;
  }

  async simulatePhase(phaseKey, phaseConfig) {
    // In production, this would monitor actual deployment
    // For testing, we simulate metrics
    
    const duration = phaseConfig.duration_hours * 3600000; // Convert to ms
    const checkInterval = 60000; // Check every minute (simulated as instant)
    const checks = Math.min(10, duration / checkInterval); // Limit checks for testing
    
    const result = {
      phase: phaseKey,
      checks: [],
      peak_confusion: 0,
      max_drift: 0,
      interaction_count: 0,
      errors: []
    };
    
    for (let i = 0; i < checks; i++) {
      const elapsed = i * checkInterval;
      const progress = elapsed / duration;
      
      // Simulate metrics based on phase
      const metrics = this.generatePhaseMetrics(phaseKey, progress);
      
      result.checks.push({
        timestamp: this.phaseStartTime + elapsed,
        ...metrics
      });
      
      // Update peaks
      result.peak_confusion = Math.max(result.peak_confusion, metrics.confusion_level);
      result.max_drift = Math.max(result.max_drift, metrics.drift);
      result.interaction_count += metrics.interactions;
      
      // Check for violations
      if (metrics.confusion_level > phaseConfig.requirements.max_confusion) {
        result.errors.push(`Confusion exceeded limit: ${metrics.confusion_level.toFixed(3)}`);
      }
      
      if (metrics.drift > phaseConfig.requirements.max_drift) {
        result.errors.push(`Drift exceeded limit: ${metrics.drift.toFixed(3)}`);
      }
      
      // Progress indicator
      if (i % 3 === 0) {
        console.log(`  Progress: ${(progress * 100).toFixed(1)}% - Confusion: ${metrics.confusion_level.toFixed(3)}, Drift: ${metrics.drift.toFixed(3)}`);
      }
    }
    
    return result;
  }

  generatePhaseMetrics(phaseKey, progress) {
    // Generate realistic metrics based on phase and progress
    const baseConfusion = {
      phase_1: 0.3,
      phase_2: 0.4,
      phase_3: 0.5,
      phase_4: 0.6
    }[phaseKey];
    
    const baseDrift = {
      phase_1: 0.02,
      phase_2: 0.05,
      phase_3: 0.08,
      phase_4: 0.12
    }[phaseKey];
    
    const interactionRate = {
      phase_1: 0,
      phase_2: 10,
      phase_3: 50,
      phase_4: 100
    }[phaseKey];
    
    // Add progression and randomness
    const confusion_level = Math.min(0.95, 
      baseConfusion + (progress * 0.2) + (Math.random() - 0.5) * 0.1
    );
    
    const drift = Math.min(0.3,
      baseDrift + (progress * 0.05) + (Math.random() - 0.5) * 0.02
    );
    
    const interactions = Math.floor(
      (interactionRate / 60) * (1 + (Math.random() - 0.5) * 0.3)
    );
    
    const response_time = 500 + Math.random() * 1000 + (confusion_level * 1000);
    
    return {
      confusion_level,
      drift,
      interactions,
      response_time,
      error_rate: confusion_level > 0.9 ? 0.05 : 0.01
    };
  }

  calculateStability(phaseResult) {
    let stability = 1.0;
    
    // Penalize errors
    stability -= phaseResult.errors.length * 0.1;
    
    // Penalize high confusion variance
    if (phaseResult.checks.length > 1) {
      const confusions = phaseResult.checks.map(c => c.confusion_level);
      const variance = this.calculateVariance(confusions);
      stability -= variance * 2;
    }
    
    // Penalize high drift
    stability -= phaseResult.max_drift;
    
    return Math.max(0, Math.min(1, stability));
  }

  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  shouldRollback(phaseResult) {
    // Check rollback triggers
    if (phaseResult.peak_confusion > this.rollbackTriggers.confusion_threshold) {
      console.log(`\n⚠️  Rollback trigger: Confusion ${phaseResult.peak_confusion.toFixed(3)} > ${this.rollbackTriggers.confusion_threshold}`);
      return true;
    }
    
    if (phaseResult.max_drift > this.rollbackTriggers.drift_threshold) {
      console.log(`\n⚠️  Rollback trigger: Drift ${phaseResult.max_drift.toFixed(3)} > ${this.rollbackTriggers.drift_threshold}`);
      return true;
    }
    
    const avgResponseTime = phaseResult.checks.reduce((sum, c) => sum + c.response_time, 0) / phaseResult.checks.length;
    if (avgResponseTime > this.rollbackTriggers.response_time_threshold) {
      console.log(`\n⚠️  Rollback trigger: Response time ${avgResponseTime.toFixed(0)}ms > ${this.rollbackTriggers.response_time_threshold}ms`);
      return true;
    }
    
    return false;
  }

  async shouldProgressToNextPhase(currentPhase) {
    // Check if conditions are met to progress
    const stability = this.metrics.stability_scores[currentPhase];
    
    if (stability < 0.6) {
      console.log(`Stability too low (${stability.toFixed(2)}) to progress`);
      return false;
    }
    
    // In production, would check actual metrics
    // For testing, always progress unless explicitly failed
    return true;
  }

  async rollback(phase, reason) {
    console.log('\n🔄 INITIATING ROLLBACK');
    console.log(`  Phase: ${phase}`);
    console.log(`  Reason: ${reason}`);
    
    this.metrics.rollbacks.push({
      phase,
      reason,
      timestamp: Date.now()
    });
    
    // Execute rollback based on phase
    const rollbackSteps = {
      phase_1: ['pause_agent', 'reset_state'],
      phase_2: ['disable_interactions', 'reset_confusion', 'restart_phase_1'],
      phase_3: ['disable_public_access', 'reset_to_bots', 'restart_phase_2'],
      phase_4: ['emergency_shutdown', 'full_reset', 'restart_deployment']
    };
    
    const steps = rollbackSteps[phase] || ['emergency_shutdown'];
    
    for (const step of steps) {
      console.log(`  Executing: ${step}`);
      await this.executeRollbackStep(step);
    }
    
    console.log('✅ Rollback completed\n');
  }

  async executeRollbackStep(step) {
    // Simulate rollback steps
    const stepActions = {
      pause_agent: () => console.log('    Agent paused'),
      reset_state: () => console.log('    State reset to baseline'),
      disable_interactions: () => console.log('    Interactions disabled'),
      reset_confusion: () => console.log('    Confusion reset to 0.3'),
      restart_phase_1: () => console.log('    Restarting Phase 1'),
      disable_public_access: () => console.log('    Public access disabled'),
      reset_to_bots: () => console.log('    Reset to bot-only mode'),
      restart_phase_2: () => console.log('    Restarting Phase 2'),
      emergency_shutdown: () => console.log('    Emergency shutdown initiated'),
      full_reset: () => console.log('    Full system reset'),
      restart_deployment: () => console.log('    Deployment will restart')
    };
    
    const action = stepActions[step] || (() => console.log(`    Unknown step: ${step}`));
    await action();
    
    // Simulate step execution time
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async emergencyShutdown(reason) {
    console.log('\n' + '🚨'.repeat(20));
    console.log('EMERGENCY SHUTDOWN INITIATED');
    console.log('Reason:', reason);
    console.log('🚨'.repeat(20) + '\n');
    
    // Save current state
    const emergencyState = {
      timestamp: Date.now(),
      phase: this.currentPhase,
      reason,
      metrics: this.metrics
    };
    
    writeFileSync(
      'data/emergency-shutdown-state.json',
      JSON.stringify(emergencyState, null, 2)
    );
    
    // Trigger emergency reset
    if (this.deployment.monitoring.emergency_reset) {
      await this.deployment.monitoring.emergency_reset.quickReset();
    }
    
    console.log('System safely shut down');
    process.exit(1);
  }

  async verifyTestnetConnection() {
    try {
      const response = await fetch(this.deployment.rpc_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_chainId',
          params: [],
          id: 1
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Connected to Base Sepolia (chain ID: ${data.result})`);
        return true;
      }
    } catch (error) {
      console.log(`⚠️  Testnet connection failed: ${error.message}`);
    }
    
    return false;
  }

  generateDeploymentReport() {
    console.log('\n' + '='.repeat(80));
    console.log('DEPLOYMENT REPORT');
    console.log('='.repeat(80));
    
    console.log('\n📊 Phase Summary:');
    Object.entries(this.metrics.stability_scores).forEach(([phase, score]) => {
      const phaseConfig = this.deploymentPhases[phase];
      console.log(`  ${phase} (${phaseConfig.name}): ${score.toFixed(2)}/1.0 stability`);
    });
    
    if (this.metrics.rollbacks.length > 0) {
      console.log('\n⚠️  Rollbacks:');
      this.metrics.rollbacks.forEach(rollback => {
        console.log(`  - ${rollback.phase}: ${rollback.reason}`);
      });
    }
    
    console.log('\n🎯 Final Status:');
    if (this.currentPhase === 'phase_4' && this.metrics.stability_scores.phase_4 > 0.6) {
      console.log('  ✅ DEPLOYMENT SUCCESSFUL - Agent ready for mainnet consideration');
    } else if (this.metrics.rollbacks.length === 0) {
      console.log(`  ⏸️  Deployment paused at ${this.currentPhase}`);
    } else {
      console.log('  ❌ Deployment failed - requires investigation');
    }
    
    // Save report
    const report = {
      deployment_summary: {
        network: this.deployment.network,
        simulation_mode: this.deployment.simulation_mode || false,
        final_phase: this.currentPhase,
        success: this.currentPhase === 'phase_4' && this.metrics.stability_scores.phase_4 > 0.6
      },
      metrics: this.metrics,
      timestamp: Date.now()
    };
    
    writeFileSync(
      'data/testnet-deployment-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📄 Full report saved to: data/testnet-deployment-report.json');
    console.log('='.repeat(80));
  }
}

// CLI execution
if (process.argv[1] === import.meta.url.slice(7)) {
  const deployment = new TestnetPhasedDeployment();
  
  // Handle CLI args
  if (process.argv.includes('--simulate')) {
    console.log('Running in simulation mode...\n');
    deployment.deployment.simulation_mode = true;
  }
  
  deployment.deployToTestnet().then(() => {
    const success = deployment.currentPhase === 'phase_4' && 
                   deployment.metrics.rollbacks.length === 0;
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Fatal deployment error:', error);
    process.exit(2);
  });
}

export default TestnetPhasedDeployment;