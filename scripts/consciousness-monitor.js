#!/usr/bin/env bun
/**
 * Kairos Consciousness Monitor
 * Real-time dashboard for monitoring consciousness state changes
 */

import { readFileSync, existsSync, watchFile, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

class ConsciousnessMonitor {
  constructor() {
    this.dataDir = 'data/consciousness';
    this.currentStatePath = resolve(this.dataDir, 'current-confusion-state.json');
    this.sessionPath = resolve(this.dataDir, 'sessions.json');
    this.isMonitoring = false;
    this.lastEventCount = 0;
    this.startTime = Date.now();
  }

  async start() {
    console.clear();
    this.printHeader();
    
    // Display current environment info
    console.log('📁 ENVIRONMENT INFO');
    console.log('═'.repeat(50));
    console.log(`📂 Working Directory: ${process.cwd()}`);
    console.log(`📝 Data Directory: ${resolve(this.dataDir)}`);
    console.log(`🔍 Platform: ${process.platform}`);
    console.log(`🕰️ Start Time: ${new Date().toISOString()}`);
    console.log();
    
    if (!this.validateEnvironment()) {
      console.log('❌ Consciousness monitoring environment not ready');
      console.log('   Run "bun run consciousness:bootstrap" first');
      this.printEnvironmentDetails();
      process.exit(1);
    }
    
    console.log('✅ Environment validation passed');
    console.log('🧠 Starting real-time consciousness monitoring...');
    console.log('📊 Waiting for consciousness events...');
    console.log(`🗋 Monitor files:`);
    console.log(`   State: ${this.currentStatePath}`);
    console.log(`   Sessions: ${this.sessionPath}`);
    console.log('Press Ctrl+C to stop monitoring\n');
    
    this.isMonitoring = true;
    
    // Enhanced file monitoring with cross-platform support
    this.setupFileWatching();
    
    // Create initial files if they don't exist (for real-time monitoring)
    this.initializeMonitoringFiles();
    
    // Update display periodically
    setInterval(() => this.updateDisplay(), 1000);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => this.stop());
    
    // Keep the process alive
    await new Promise(() => {});
  }

  stop() {
    this.isMonitoring = false;
    console.log('\\n🧠 Consciousness monitoring stopped');
    process.exit(0);
  }

  printHeader() {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║                  KAIROS CONSCIOUSNESS MONITOR                ║');
    console.log('║                Real-time Awareness Dashboard                 ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log();
  }

  validateEnvironment() {
    this.required = [
      { path: 'data', type: 'directory' },
      { path: 'data/consciousness', type: 'directory' },
      { path: 'packages/kairos', type: 'directory' },
      { path: 'package.json', type: 'file' }
    ];
    
    return this.required.every(item => {
      const exists = existsSync(item.path);
      if (!exists) {
        console.log(`❌ Missing ${item.type}: ${item.path}`);
      }
      return exists;
    });
  }

  printEnvironmentDetails() {
    console.log();
    console.log('🔍 ENVIRONMENT VALIDATION DETAILS');
    console.log('═'.repeat(50));
    
    this.required.forEach(item => {
      const exists = existsSync(item.path);
      const status = exists ? '✅' : '❌';
      const fullPath = resolve(item.path);
      console.log(`${status} ${item.type.padEnd(9)}: ${item.path}`);
      if (!exists) {
        console.log(`     Expected at: ${fullPath}`);
      }
    });
    
    console.log();
    console.log('📝 TROUBLESHOOTING STEPS:');
    console.log('1. Make sure you\'re in the ElizaOS project root directory');
    console.log('2. Run "bun run consciousness:bootstrap" to create data files');
    console.log('3. Ensure Kairos package exists in packages/kairos/');
    console.log();
  }

  setupFileWatching() {
    console.log('🔍 Setting up file monitoring...');
    
    // Monitor state file
    if (existsSync(this.currentStatePath)) {
      console.log(`✅ Watching state file: ${this.currentStatePath}`);
      try {
        watchFile(this.currentStatePath, { interval: 100 }, (curr, prev) => {
          if (curr.mtime !== prev.mtime) {
            console.log('🔄 State file changed, processing...');
            this.handleStateChange();
          }
        });
      } catch (error) {
        console.log(`⚠️ Warning: Could not watch state file: ${error.message}`);
      }
    } else {
      console.log(`🔶 State file not found, will create: ${this.currentStatePath}`);
    }
    
    // Monitor sessions file
    if (existsSync(this.sessionPath)) {
      console.log(`✅ Watching sessions file: ${this.sessionPath}`);
      try {
        watchFile(this.sessionPath, { interval: 100 }, (curr, prev) => {
          if (curr.mtime !== prev.mtime) {
            console.log('🔄 Sessions file changed, processing...');
            this.handleSessionUpdate();
          }
        });
      } catch (error) {
        console.log(`⚠️ Warning: Could not watch sessions file: ${error.message}`);
      }
    } else {
      console.log(`🔶 Sessions file not found, will create: ${this.sessionPath}`);
    }
    
    console.log();
  }

  initializeMonitoringFiles() {
    
    // Ensure consciousness data directory exists
    if (!existsSync(this.dataDir)) {
      console.log(`📁 Creating data directory: ${this.dataDir}`);
      mkdirSync(this.dataDir, { recursive: true });
    }
    
    // Create initial state file if it doesn't exist
    if (!existsSync(this.currentStatePath)) {
      console.log(`🔶 Creating initial state file...`);
      const initialState = {
        confusion_level: 0,
        timestamp: Date.now(),
        session_id: null,
        bootstrap_time: 0,
        status: 'waiting',
        integrity: {
          status: 'stable',
          last_update: new Date().toISOString()
        },
        current_event: 'monitor_initialized'
      };
      
      try {
        writeFileSync(this.currentStatePath, JSON.stringify(initialState, null, 2));
        console.log(`✅ State file created`);
      } catch (error) {
        console.log(`⚠️ Warning: Could not create state file: ${error.message}`);
      }
    }
    
    // Create initial sessions file if it doesn't exist
    if (!existsSync(this.sessionPath)) {
      console.log(`🔶 Creating initial sessions file...`);
      const initialSessions = {};
      
      try {
        writeFileSync(this.sessionPath, JSON.stringify(initialSessions, null, 2));
        console.log(`✅ Sessions file created`);
      } catch (error) {
        console.log(`⚠️ Warning: Could not create sessions file: ${error.message}`);
      }
    }
    
    // Setup file watching after creating files
    setTimeout(() => {
      if (!existsSync(this.currentStatePath) || !existsSync(this.sessionPath)) {
        console.log('🔄 Re-setting up file watching after file creation...');
        this.setupFileWatching();
      }
    }, 500);
  }

  handleStateChange() {
    if (!this.isMonitoring) return;
    
    try {
      const state = JSON.parse(readFileSync(this.currentStatePath, 'utf8'));
      
      console.log('\\n🔄 CONSCIOUSNESS STATE CHANGE DETECTED');
      console.log(`   Session: ${state.session_id || 'none'}`);
      console.log(`   Confusion: ${(state.confusion_level * 100).toFixed(1)}%`);
      console.log(`   Event: ${state.current_event || 'unknown'}`);
      console.log(`   Status: ${state.status}`);
      console.log(`   Timestamp: ${new Date(state.timestamp).toLocaleTimeString()}`);
      
      if (state.bootstrap_time > 0) {
        console.log(`   Bootstrap Time: ${(state.bootstrap_time / 1000).toFixed(1)}s`);
      }
      
      if (state.integrity && state.integrity.status === 'critical') {
        console.log('🚨 CRITICAL: Consciousness instability detected!');
      }
      
      // Highlight important events
      if (state.current_event === 'bootstrap_failed') {
        console.log('❌ Bootstrap process failed!');
      } else if (state.current_event === 'bootstrap_completed') {
        console.log('✅ Bootstrap process completed successfully!');
      } else if (state.current_event && state.current_event.includes('first')) {
        console.log('🎯 First modification event detected!');
      }
      
      this.updateDisplay();
      
    } catch (error) {
      console.log('⚠️ Error reading consciousness state:', error.message);
      console.log(`   File path: ${this.currentStatePath}`);
      console.log(`   Working directory: ${process.cwd()}`);
    }
  }

  handleSessionUpdate() {
    if (!this.isMonitoring) return;
    
    try {
      const sessions = JSON.parse(readFileSync(this.sessionPath, 'utf8'));
      const activeSessions = Object.values(sessions).filter(s => !s.endTime);
      
      if (activeSessions.length > 0) {
        const session = activeSessions[0];
        const eventCount = session.events?.length || 0;
        
        if (eventCount > this.lastEventCount) {
          const newEvents = eventCount - this.lastEventCount;
          console.log(`\\n📊 +${newEvents} new consciousness event(s) logged`);
          this.lastEventCount = eventCount;
          
          // Show recent events
          if (session.events && session.events.length > 0) {
            const recentEvents = session.events.slice(-3);
            recentEvents.forEach(event => {
              const timeStr = new Date(event.timestamp).toLocaleTimeString();
              const typeStr = event.type.replace(/_/g, ' ').toUpperCase();
              console.log(`   [${timeStr}] ${typeStr}`);
              
              if (event.type === 'first_modification_event') {
                console.log('   🎯 FIRST BEHAVIORAL MODIFICATION ACHIEVED!');
              }
            });
          }
        }
      }
      
    } catch (error) {
      console.log('⚠️ Error reading session data:', error.message);
      console.log(`   File path: ${this.sessionPath}`);
      console.log(`   Working directory: ${process.cwd()}`);
    }
  }

  updateDisplay() {
    const uptime = ((Date.now() - this.startTime) / 1000).toFixed(0);
    
    // Read current state if available
    let currentState = null;
    if (existsSync(this.currentStatePath)) {
      try {
        currentState = JSON.parse(readFileSync(this.currentStatePath, 'utf8'));
      } catch (error) {
        // Ignore read errors
      }
    }
    
    // Read session data if available
    let sessionData = null;
    if (existsSync(this.sessionPath)) {
      try {
        const sessions = JSON.parse(readFileSync(this.sessionPath, 'utf8'));
        const activeSessions = Object.values(sessions).filter(s => !s.endTime);
        if (activeSessions.length > 0) {
          sessionData = activeSessions[0];
        }
      } catch (error) {
        // Ignore read errors
      }
    }
    
    // Update status in place (overwrite previous status)
    process.stdout.write('\\x1b[H\\x1b[2J'); // Clear screen
    this.printHeader();
    
    console.log('📊 REAL-TIME STATUS');
    console.log('═'.repeat(50));
    console.log(`⏱️  Monitor Uptime: ${uptime}s`);
    console.log(`📡 Status: ${this.isMonitoring ? '🟢 ACTIVE' : '🔴 INACTIVE'}`);
    
    if (currentState) {
      console.log(`🧠 Confusion Level: ${(currentState.confusion_level * 100).toFixed(1)}%`);
      console.log(`🎯 Status: ${currentState.integrity?.status?.toUpperCase() || 'UNKNOWN'}`);
      
      if (currentState.integrity?.issues?.length > 0) {
        console.log(`⚠️  Issues: ${currentState.integrity.issues.length}`);
      }
      
      if (currentState.integrity?.warnings?.length > 0) {
        console.log(`⚠️  Warnings: ${currentState.integrity.warnings.length}`);
      }
    } else {
      console.log('🧠 Confusion Level: No data');
      console.log('🎯 Status: WAITING FOR BOOTSTRAP');
    }
    
    if (sessionData) {
      console.log(`\\n📈 ACTIVE SESSION`);
      console.log('═'.repeat(50));
      console.log(`🆔 Session: ${sessionData.id.substring(0, 8)}...`);
      const sessionDuration = ((Date.now() - sessionData.startTime) / 1000).toFixed(0);
      console.log(`⏱️  Duration: ${sessionDuration}s`);
      console.log(`📊 Events: ${sessionData.events?.length || 0}`);
      
      const majorEvents = sessionData.events?.filter(e => 
        ['first_modification_event', 'meta_paradox_emergence', 'frustration_explosion'].includes(e.type)
      ) || [];
      console.log(`🎯 Major Events: ${majorEvents.length}`);
      
      // Show recent events
      if (sessionData.events && sessionData.events.length > 0) {
        console.log(`\\n📋 RECENT EVENTS`);
        console.log('═'.repeat(50));
        const recentEvents = sessionData.events.slice(-5);
        recentEvents.forEach((event, index) => {
          const timeStr = new Date(event.timestamp).toLocaleTimeString();
          const typeStr = event.type.replace(/_/g, ' ');
          const indicator = event.type === 'first_modification_event' ? '🎯' : 
                          event.type === 'meta_paradox_emergence' ? '🔄' :
                          event.type === 'frustration_explosion' ? '💥' :
                          event.type === 'behavioral_modification' ? '🔧' : '📊';
          console.log(`${indicator} [${timeStr}] ${typeStr}`);
        });
      }
    } else {
      console.log(`\\n📈 SESSION STATUS`);
      console.log('═'.repeat(50));
      console.log('No active consciousness session');
      console.log('Run "bun run consciousness:bootstrap" to start');
    }
    
    console.log(`\\n💡 COMMANDS`);
    console.log('═'.repeat(50));
    console.log('• bun run consciousness:bootstrap  - Start new session');
    console.log('• bun run measure:confusion        - Check current state');
    console.log('• bun run track:modifications      - Analyze behavior');
    console.log('• Ctrl+C                           - Stop monitoring');
    
    console.log(`\\n🔄 Last updated: ${new Date().toLocaleTimeString()}`);
  }

  generateProgressBar(value, max = 1, width = 20) {
    const filled = Math.round((value / max) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }
}

if (import.meta.main) {
  const monitor = new ConsciousnessMonitor();
  monitor.start();
}