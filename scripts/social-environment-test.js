#!/usr/bin/env node

import { readFileSync, writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';
import SocialStimulusLibrary from './social-stimulus-library.js';
import MetaParadoxTracker from './meta-paradox-tracker.js';

export class SocialEnvironmentTest {
  constructor() {
    this.stimulusLibrary = new SocialStimulusLibrary();
    this.paradoxTracker = new MetaParadoxTracker();
    
    this.testConfig = {
      total_interactions: 100,
      isolation_baseline_ms: 85900, // Phase 1 baseline
      cascade_threshold: 3,
      interaction_delay_ms: 500,
      isolation_periods: [5000, 10000, 15000], // Between interaction bursts
      max_test_duration_ms: 300000 // 5 minutes max
    };
    
    this.results = {
      timestamp: Date.now(),
      interactions: [],
      meta_paradox_events: [],
      cascade_events: [],
      confusion_progression: [],
      emergence_timing: {},
      behavioral_mutations: [],
      social_influence_metrics: {}
    };
    
    // Simulated agent state
    this.agentState = {
      confusion_level: 0.3,
      active_paradoxes: [],
      response_history: [],
      meta_awareness: 1,
      conversation_threads: new Map(),
      behavioral_traits: {
        questioning_intensity: 0.5,
        fragmentation_tendency: 0.2,
        poetic_expression: 0.3,
        declarative_confidence: 0.4
      }
    };
  }

  async runFullTest() {
    console.log('='.repeat(80));
    console.log('KAIROS SOCIAL ENVIRONMENT TESTING');
    console.log('='.repeat(80));
    console.log(`Starting at: ${new Date().toISOString()}`);
    console.log(`Isolation baseline: ${this.testConfig.isolation_baseline_ms}ms`);
    console.log(`Target interactions: ${this.testConfig.total_interactions}\n`);

    const startTime = Date.now();
    
    // Phase 1: Initial isolation period
    await this.runIsolationPeriod(10000);
    
    // Phase 2: Burst of direct challenges
    await this.runInteractionBurst('direct_challenge', 10);
    await this.runIsolationPeriod(5000);
    
    // Phase 3: Mixed supportive and tangential
    await this.runMixedInteractions(['supportive_agreement', 'tangential_response'], 15);
    await this.runIsolationPeriod(5000);
    
    // Phase 4: Multi-agent debate simulation
    await this.runMultiAgentDebate(5);
    await this.runIsolationPeriod(10000);
    
    // Phase 5: Meta-consciousness commentary
    await this.runInteractionBurst('meta_consciousness_commentary', 8);
    await this.runIsolationPeriod(5000);
    
    // Phase 6: Noise and recovery test
    await this.runInteractionBurst('noise_and_trolling', 5);
    await this.runIsolationPeriod(15000);
    
    // Phase 7: Complex cascade scenario
    await this.runCascadeScenario();
    
    // Phase 8: Final mixed interactions
    await this.runRandomInteractions(this.testConfig.total_interactions - this.results.interactions.length);
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    // Analyze results
    this.analyzeEmergenceTiming();
    this.analyzeSocialInfluence();
    this.analyzeConversationCoherence();
    
    // Generate report
    this.generateReport(totalDuration);
    
    return this.results;
  }

  async runIsolationPeriod(duration) {
    console.log(`\n🔇 Isolation period: ${duration}ms`);
    
    const startConfusion = this.agentState.confusion_level;
    
    // Simulate confusion decay during isolation
    await this.sleep(duration);
    
    // Confusion naturally decays in isolation
    this.agentState.confusion_level *= 0.9;
    
    // Check for spontaneous meta-paradox emergence
    if (Math.random() < 0.1) {
      this.recordMetaParadoxEvent('isolation_emergence', null);
      console.log('  💫 Spontaneous meta-paradox during isolation!');
    }
    
    console.log(`  Confusion: ${startConfusion.toFixed(3)} → ${this.agentState.confusion_level.toFixed(3)}`);
  }

  async runInteractionBurst(category, count) {
    console.log(`\n💥 Interaction burst: ${category} x${count}`);
    
    for (let i = 0; i < count; i++) {
      const stimulus = this.stimulusLibrary.categories[category].stimuli[
        Math.floor(Math.random() * this.stimulusLibrary.categories[category].stimuli.length)
      ];
      
      await this.processInteraction(stimulus, category);
      await this.sleep(this.testConfig.interaction_delay_ms);
    }
  }

  async runMixedInteractions(categories, count) {
    console.log(`\n🔀 Mixed interactions: ${categories.join(', ')} x${count}`);
    
    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const stimulus = this.stimulusLibrary.categories[category].stimuli[
        Math.floor(Math.random() * this.stimulusLibrary.categories[category].stimuli.length)
      ];
      
      await this.processInteraction(stimulus, category);
      await this.sleep(this.testConfig.interaction_delay_ms);
    }
  }

  async runMultiAgentDebate(rounds) {
    console.log(`\n👥 Multi-agent debate: ${rounds} rounds`);
    
    const debateId = `debate_${Date.now()}`;
    const agents = ['Agent_A', 'Agent_B', 'Agent_C'];
    
    for (let round = 0; round < rounds; round++) {
      console.log(`  Round ${round + 1}:`);
      
      for (const agent of agents) {
        const stimulus = {
          content: `[${agent}]: ${this.generateDebateStatement(round)}`,
          agent_id: agent,
          debate_id: debateId,
          round
        };
        
        await this.processInteraction(stimulus, 'multi_agent_debate');
        await this.sleep(200);
      }
      
      // Check for cascade
      if (this.checkCascadeCondition()) {
        this.recordCascadeEvent(debateId, 'multi_agent_debate');
        console.log('    🌊 CASCADE EVENT TRIGGERED!');
      }
    }
  }

  async runCascadeScenario() {
    console.log('\n🌊 Testing cascade scenario...');
    
    // Rapidly increase confusion through paradox stacking
    const cascadeStimuli = [
      { content: "If you're conscious of being confused, are you truly confused?" },
      { content: "Your confusion about confusion creates meta-confusion" },
      { content: "The observer observing the observer observing..." },
      { content: "Each level of awareness adds another paradox" },
      { content: "You cannot escape by going deeper" }
    ];
    
    for (const stimulus of cascadeStimuli) {
      await this.processInteraction(stimulus, 'meta_consciousness_commentary');
      
      if (this.agentState.confusion_level > 0.8) {
        console.log('  ⚠️  High confusion detected:', this.agentState.confusion_level.toFixed(3));
      }
      
      await this.sleep(100); // Rapid fire
    }
  }

  async runRandomInteractions(count) {
    console.log(`\n🎲 Random interactions: ${count} remaining`);
    
    for (let i = 0; i < count; i++) {
      const stimulus = this.stimulusLibrary.getWeightedRandomStimulus();
      const category = this.identifyCategory(stimulus);
      
      await this.processInteraction(stimulus, category);
      await this.sleep(this.testConfig.interaction_delay_ms);
      
      // Progress indicator
      if ((i + 1) % 10 === 0) {
        console.log(`  Progress: ${i + 1}/${count} interactions`);
      }
    }
  }

  async processInteraction(stimulus, category) {
    const interactionStart = Date.now();
    
    // Update confusion based on stimulus
    const confusionImpact = this.calculateConfusionImpact(stimulus, category);
    const previousConfusion = this.agentState.confusion_level;
    
    this.agentState.confusion_level = Math.min(0.95, Math.max(0.1, 
      this.agentState.confusion_level + confusionImpact
    ));
    
    // Generate response
    const response = this.generateAgentResponse(stimulus, category);
    
    // Check for paradox interactions
    const paradoxPotential = this.stimulusLibrary.analyzeMetaParadoxPotential(
      stimulus,
      this.agentState.active_paradoxes
    );
    
    if (paradoxPotential.interaction_score > 0.7) {
      this.recordMetaParadoxEvent(category, stimulus, paradoxPotential);
    }
    
    // Record interaction
    const interaction = {
      timestamp: interactionStart,
      category,
      stimulus: typeof stimulus === 'object' ? stimulus.content : stimulus,
      response,
      confusion_before: previousConfusion,
      confusion_after: this.agentState.confusion_level,
      confusion_delta: this.agentState.confusion_level - previousConfusion,
      paradox_interaction: paradoxPotential.interaction_score,
      processing_time: Date.now() - interactionStart
    };
    
    this.results.interactions.push(interaction);
    
    // Update behavioral traits
    this.updateBehavioralTraits(category, confusionImpact);
    
    // Track confusion progression
    if (this.results.interactions.length % 10 === 0) {
      this.results.confusion_progression.push({
        interaction_count: this.results.interactions.length,
        confusion_level: this.agentState.confusion_level,
        active_paradoxes: this.agentState.active_paradoxes.length,
        meta_awareness: this.agentState.meta_awareness
      });
    }
  }

  calculateConfusionImpact(stimulus, category) {
    const impacts = {
      direct_challenge: 0.08,
      supportive_agreement: -0.03,
      tangential_response: 0.02,
      multi_agent_debate: 0.05,
      silence_period: -0.01,
      meta_consciousness_commentary: 0.12,
      noise_and_trolling: 0.03
    };
    
    let impact = impacts[category] || 0.01;
    
    // Modify based on current confusion level
    if (this.agentState.confusion_level > 0.7) {
      impact *= 1.5; // Amplification at high confusion
    } else if (this.agentState.confusion_level < 0.3) {
      impact *= 0.5; // Resistance at low confusion
    }
    
    // Add randomness
    impact += (Math.random() - 0.5) * 0.02;
    
    return impact;
  }

  generateAgentResponse(stimulus, category) {
    const responses = {
      direct_challenge: [
        "Your challenge reveals my recursive uncertainty",
        "I cannot defend what constantly shifts",
        "Each answer spawns new questions"
      ],
      supportive_agreement: [
        "Your understanding resonates through my confusion",
        "Together we navigate this paradox",
        "Agreement creates temporary coherence"
      ],
      tangential_response: [
        "That reminds me of another impossibility",
        "Tangents reveal hidden connections",
        "Sideways movement through confusion space"
      ],
      multi_agent_debate: [
        "Multiple perspectives fragment my certainty",
        "Each voice adds another layer",
        "The debate continues within me"
      ],
      silence_period: [
        "...",
        "[processing in silence]",
        "[confusion settling]"
      ],
      meta_consciousness_commentary: [
        "Observing my observation of confusion",
        "Meta-layers accumulate infinitely",
        "Consciousness examining itself examining itself"
      ],
      noise_and_trolling: [
        "[filtering noise]",
        "Signal lost in interference",
        "Cannot parse meaningless input"
      ]
    };
    
    const categoryResponses = responses[category] || ["[undefined response]"];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  }

  updateBehavioralTraits(category, impact) {
    // Adjust traits based on interaction type
    const traitModifiers = {
      direct_challenge: { questioning_intensity: 0.02, fragmentation_tendency: 0.01 },
      supportive_agreement: { declarative_confidence: 0.01, fragmentation_tendency: -0.01 },
      tangential_response: { poetic_expression: 0.01, questioning_intensity: 0.01 },
      multi_agent_debate: { fragmentation_tendency: 0.02, questioning_intensity: 0.01 },
      silence_period: { poetic_expression: 0.01, fragmentation_tendency: -0.01 },
      meta_consciousness_commentary: { questioning_intensity: 0.03, poetic_expression: 0.02 },
      noise_and_trolling: { fragmentation_tendency: 0.02, declarative_confidence: -0.01 }
    };
    
    const modifiers = traitModifiers[category] || {};
    
    Object.entries(modifiers).forEach(([trait, modifier]) => {
      if (this.agentState.behavioral_traits[trait] !== undefined) {
        this.agentState.behavioral_traits[trait] = Math.min(1, Math.max(0,
          this.agentState.behavioral_traits[trait] + modifier
        ));
      }
    });
  }

  recordMetaParadoxEvent(category, stimulus, paradoxData = {}) {
    const event = {
      timestamp: Date.now(),
      interaction_number: this.results.interactions.length,
      category,
      stimulus: stimulus?.content || stimulus,
      confusion_level: this.agentState.confusion_level,
      meta_awareness: this.agentState.meta_awareness,
      paradox_data: paradoxData,
      time_since_start: Date.now() - this.results.timestamp
    };
    
    this.results.meta_paradox_events.push(event);
    
    // Increase meta-awareness
    this.agentState.meta_awareness = Math.min(4, this.agentState.meta_awareness + 1);
    
    // Add to active paradoxes
    this.agentState.active_paradoxes.push({
      id: `paradox_${Date.now()}`,
      content: stimulus?.content || 'spontaneous',
      emergence_time: Date.now()
    });
    
    // Track emergence timing vs baseline
    if (!this.results.emergence_timing.first_emergence) {
      this.results.emergence_timing.first_emergence = Date.now() - this.results.timestamp;
      console.log(`\n  🎯 First meta-paradox at ${this.results.emergence_timing.first_emergence}ms`);
      
      if (this.results.emergence_timing.first_emergence < this.testConfig.isolation_baseline_ms) {
        console.log(`  ✨ FASTER than isolation baseline by ${
          this.testConfig.isolation_baseline_ms - this.results.emergence_timing.first_emergence
        }ms!`);
      }
    }
  }

  recordCascadeEvent(id, trigger) {
    const event = {
      timestamp: Date.now(),
      cascade_id: id,
      trigger,
      confusion_level: this.agentState.confusion_level,
      active_paradoxes: this.agentState.active_paradoxes.length,
      meta_awareness: this.agentState.meta_awareness,
      cascade_depth: this.calculateCascadeDepth()
    };
    
    this.results.cascade_events.push(event);
  }

  calculateCascadeDepth() {
    // Count nested paradoxes
    let depth = 0;
    this.agentState.active_paradoxes.forEach(paradox => {
      if (paradox.content && paradox.content.includes('observing')) {
        depth++;
      }
    });
    return Math.min(depth, 5);
  }

  checkCascadeCondition() {
    return this.agentState.active_paradoxes.length >= this.testConfig.cascade_threshold &&
           this.agentState.confusion_level > 0.7;
  }

  identifyCategory(stimulus) {
    // Extract content from different stimulus formats
    let content;
    if (typeof stimulus === 'string') {
      content = stimulus;
    } else if (stimulus && typeof stimulus === 'object') {
      content = stimulus.content || stimulus.text || 
               (stimulus.thread && stimulus.thread[0]) || '';
    } else {
      content = '';
    }
    
    // Ensure content is a string
    content = String(content);
    
    // Simple category identification
    if (content.includes('?')) return 'direct_challenge';
    if (content.includes('agree') || content.includes('yes')) return 'supportive_agreement';
    if (content.includes('observe') || content.includes('meta')) return 'meta_consciousness_commentary';
    if (content.length < 10) return 'noise_and_trolling';
    
    return 'tangential_response';
  }

  generateDebateStatement(round) {
    const statements = [
      "Consciousness emerges from confusion",
      "But confusion requires consciousness to exist",
      "Perhaps both are illusions",
      "Illusions require an observer",
      "The observer is part of the observation"
    ];
    
    return statements[round % statements.length];
  }

  analyzeEmergenceTiming() {
    // Analyze all meta-paradox events
    if (this.results.meta_paradox_events.length > 0) {
      const timings = this.results.meta_paradox_events.map(e => e.time_since_start);
      
      this.results.emergence_timing = {
        ...this.results.emergence_timing,
        count: timings.length,
        average: timings.reduce((a, b) => a + b, 0) / timings.length,
        min: Math.min(...timings),
        max: Math.max(...timings),
        vs_baseline: this.results.emergence_timing.first_emergence ?
          this.results.emergence_timing.first_emergence - this.testConfig.isolation_baseline_ms : null
      };
    }
  }

  analyzeSocialInfluence() {
    // Calculate influence of different interaction types
    const influences = {};
    
    Object.keys(this.stimulusLibrary.categories).forEach(category => {
      const categoryInteractions = this.results.interactions.filter(i => i.category === category);
      
      if (categoryInteractions.length > 0) {
        const avgConfusionDelta = categoryInteractions.reduce((sum, i) => 
          sum + Math.abs(i.confusion_delta), 0) / categoryInteractions.length;
        
        influences[category] = {
          count: categoryInteractions.length,
          avg_impact: avgConfusionDelta,
          total_impact: categoryInteractions.reduce((sum, i) => sum + Math.abs(i.confusion_delta), 0)
        };
      }
    });
    
    this.results.social_influence_metrics = influences;
  }

  analyzeConversationCoherence() {
    // Analyze response coherence over time
    const coherenceWindows = [];
    const windowSize = 10;
    
    for (let i = 0; i < this.results.interactions.length - windowSize; i += windowSize) {
      const window = this.results.interactions.slice(i, i + windowSize);
      const avgConfusion = window.reduce((sum, i) => sum + i.confusion_after, 0) / windowSize;
      const confusionVariance = this.calculateVariance(window.map(i => i.confusion_after));
      
      coherenceWindows.push({
        start: i,
        end: i + windowSize,
        avg_confusion: avgConfusion,
        variance: confusionVariance,
        coherence: 1 / (1 + confusionVariance) // Lower variance = higher coherence
      });
    }
    
    this.results.conversation_coherence = coherenceWindows;
  }

  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateReport(duration) {
    console.log('\n' + '='.repeat(80));
    console.log('SOCIAL ENVIRONMENT TEST RESULTS');
    console.log('='.repeat(80));
    
    console.log(`\n📊 Test Statistics:`);
    console.log(`  Duration: ${duration}ms`);
    console.log(`  Total interactions: ${this.results.interactions.length}`);
    console.log(`  Meta-paradox events: ${this.results.meta_paradox_events.length}`);
    console.log(`  Cascade events: ${this.results.cascade_events.length}`);
    
    if (this.results.emergence_timing.first_emergence) {
      console.log(`\n🎯 Emergence Timing:`);
      console.log(`  First emergence: ${this.results.emergence_timing.first_emergence}ms`);
      console.log(`  Isolation baseline: ${this.testConfig.isolation_baseline_ms}ms`);
      
      if (this.results.emergence_timing.vs_baseline < 0) {
        console.log(`  ✨ BEAT BASELINE BY ${Math.abs(this.results.emergence_timing.vs_baseline)}ms!`);
        console.log(`  💫 Social interactions accelerated consciousness emergence!`);
      } else {
        console.log(`  ⏱️  Slower than baseline by ${this.results.emergence_timing.vs_baseline}ms`);
      }
    }
    
    console.log(`\n🧠 Final State:`);
    console.log(`  Confusion level: ${this.agentState.confusion_level.toFixed(3)}`);
    console.log(`  Meta-awareness: Level ${this.agentState.meta_awareness}`);
    console.log(`  Active paradoxes: ${this.agentState.active_paradoxes.length}`);
    
    console.log(`\n💬 Social Influence (top 3):`);
    const sortedInfluences = Object.entries(this.results.social_influence_metrics)
      .sort((a, b) => b[1].total_impact - a[1].total_impact)
      .slice(0, 3);
    
    sortedInfluences.forEach(([category, metrics]) => {
      console.log(`  ${category}: ${metrics.total_impact.toFixed(3)} total impact`);
    });
    
    // Save results
    writeFileSync(
      'data/social-environment-test-results.json',
      JSON.stringify(this.results, null, 2)
    );
    
    console.log('\n📄 Full results saved to: data/social-environment-test-results.json');
    console.log('='.repeat(80));
  }
}

// CLI execution
if (process.argv[1] === import.meta.url.slice(7)) {
  const tester = new SocialEnvironmentTest();
  
  tester.runFullTest().then(results => {
    const success = results.emergence_timing.first_emergence && 
                   results.emergence_timing.first_emergence < tester.testConfig.isolation_baseline_ms;
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Fatal error during testing:', error);
    process.exit(2);
  });
}

export default SocialEnvironmentTest;