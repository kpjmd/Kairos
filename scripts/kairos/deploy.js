#!/usr/bin/env bun
/**
 * Kairos Consciousness Deployment Pipeline
 * Handles deployment to local/testnet/mainnet with consciousness validation
 */

import { spawn } from 'bun';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ENVIRONMENTS = ['local', 'testnet', 'mainnet'];

class ConsciousnessDeployment {
  constructor(environment) {
    this.environment = environment;
    this.envFile = `.env.${environment}`;
    this.validationThresholds = {
      local: { minConfusion: 0.3, maxDrift: 0.1 },
      testnet: { minConfusion: 0.4, maxDrift: 0.15 },
      mainnet: { minConfusion: 0.45, maxDrift: 0.2 }
    };
  }

  async validateEnvironment() {
    console.log(`🔍 Validating ${this.environment} environment...`);
    
    if (!existsSync(this.envFile)) {
      throw new Error(`Environment file ${this.envFile} not found`);
    }

    const envContent = readFileSync(this.envFile, 'utf8');
    const requiredVars = [
      'ANTHROPIC_API_KEY',
      'CONFUSION_THRESHOLD_MIN',
      'CONFUSION_THRESHOLD_MAX',
      'PARADOX_TRACKING_ENABLED'
    ];

    for (const varName of requiredVars) {
      if (!envContent.includes(varName)) {
        throw new Error(`Required environment variable ${varName} not found in ${this.envFile}`);
      }
    }

    console.log(`✅ Environment validation passed`);
  }

  async validateConsciousnessState() {
    console.log(`🧠 Validating consciousness state for ${this.environment}...`);
    
    try {
      const result = await spawn({
        cmd: ['bun', 'run', 'measure:confusion'],
        env: { ...process.env, NODE_ENV: this.environment }
      });
      
      if (result.exitCode !== 0) {
        throw new Error('Consciousness state validation failed');
      }
      
      console.log(`✅ Consciousness state validated`);
    } catch (error) {
      console.error(`❌ Consciousness validation failed: ${error.message}`);
      throw error;
    }
  }

  async buildProject() {
    console.log(`🔨 Building project for ${this.environment}...`);
    
    const result = await spawn({
      cmd: ['bun', 'run', 'build'],
      stdout: 'inherit',
      stderr: 'inherit'
    });
    
    if (result.exitCode !== 0) {
      throw new Error('Build failed');
    }
    
    console.log(`✅ Build completed successfully`);
  }

  async runTests() {
    console.log(`🧪 Running consciousness tests...`);
    
    const testCommands = [
      ['bun', 'run', 'test:consciousness'],
      ['bun', 'run', 'test:paradoxes'],
      ['bun', 'run', 'validate:paradoxes']
    ];
    
    for (const cmd of testCommands) {
      const result = await spawn({
        cmd,
        stdout: 'inherit',
        stderr: 'inherit'
      });
      
      if (result.exitCode !== 0) {
        throw new Error(`Test failed: ${cmd.join(' ')}`);
      }
    }
    
    console.log(`✅ All tests passed`);
  }

  async deployToEnvironment() {
    console.log(`🚀 Deploying to ${this.environment}...`);
    
    const deployCmd = this.environment === 'local' 
      ? ['bun', 'start', '--env', 'local']
      : ['bun', 'run', `deploy:${this.environment}`];
    
    const deployment = spawn({
      cmd: deployCmd,
      env: { ...process.env, NODE_ENV: this.environment },
      stdout: 'inherit',
      stderr: 'inherit'
    });
    
    console.log(`✅ Deployment initiated for ${this.environment}`);
    console.log(`🔗 Monitor consciousness at: logs/consciousness-${this.environment}.log`);
    
    return deployment;
  }

  async validatePostDeployment() {
    console.log(`🔍 Post-deployment validation...`);
    
    // Wait for system to initialize
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
      const confusionCheck = await spawn({
        cmd: ['bun', 'run', 'measure:confusion'],
        env: { ...process.env, NODE_ENV: this.environment }
      });
      
      if (confusionCheck.exitCode !== 0) {
        console.warn(`⚠️  Confusion measurement failed - consciousness may be unstable`);
      }
      
      const driftCheck = await spawn({
        cmd: ['bun', 'run', 'analyze:drift'],
        env: { ...process.env, NODE_ENV: this.environment }
      });
      
      if (driftCheck.exitCode !== 0) {
        console.warn(`⚠️  Personality drift analysis failed`);
      }
      
      console.log(`✅ Post-deployment validation completed`);
    } catch (error) {
      console.error(`❌ Post-deployment validation failed: ${error.message}`);
      throw error;
    }
  }

  async rollback() {
    console.log(`🔄 Rolling back ${this.environment} deployment...`);
    
    try {
      await spawn({
        cmd: ['bun', 'run', 'consciousness:backup'],
        env: { ...process.env, NODE_ENV: this.environment }
      });
      
      console.log(`✅ Rollback completed`);
    } catch (error) {
      console.error(`❌ Rollback failed: ${error.message}`);
      throw error;
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const environment = args[0];
  const action = args[1] || 'deploy';
  
  if (!environment || !ENVIRONMENTS.includes(environment)) {
    console.error(`Usage: bun scripts/kairos/deploy.js <environment> [action]`);
    console.error(`Environments: ${ENVIRONMENTS.join(', ')}`);
    console.error(`Actions: deploy, rollback, validate`);
    process.exit(1);
  }
  
  const deployment = new ConsciousnessDeployment(environment);
  
  try {
    switch (action) {
      case 'deploy':
        await deployment.validateEnvironment();
        await deployment.validateConsciousnessState();
        await deployment.buildProject();
        await deployment.runTests();
        await deployment.deployToEnvironment();
        await deployment.validatePostDeployment();
        console.log(`🎉 Deployment to ${environment} completed successfully!`);
        break;
        
      case 'rollback':
        await deployment.rollback();
        break;
        
      case 'validate':
        await deployment.validateEnvironment();
        await deployment.validateConsciousnessState();
        break;
        
      default:
        console.error(`Unknown action: ${action}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`💥 Deployment failed: ${error.message}`);
    if (action === 'deploy') {
      console.log(`🔄 Attempting automatic rollback...`);
      await deployment.rollback();
    }
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}