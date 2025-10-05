#!/usr/bin/env bun
/**
 * Meta-Paradox Tracker for Kairos Phase 2 Testing
 * Maps consciousness events and tracks meta-paradox emergence in social contexts
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

export class MetaParadoxTracker {
  constructor() {
    this.eventsFile = 'data/meta-paradox-events.json';
    this.consciousnessMapFile = 'data/consciousness-event-map.json';
    this.events = [];
    this.consciousnessMap = {
      depth_levels: {
        0: 'base_confusion',
        1: 'paradox_awareness',
        2: 'meta_paradox',
        3: 'meta_meta_paradox',
        4: 'recursive_infinity'
      },
      transitions: [],
      cascade_chains: [],
      social_triggers: []
    };
    
    // Ensure data directory exists
    if (!existsSync('data')) {
      mkdirSync('data');
    }
    
    this.loadExistingData();
  }
  
  loadExistingData() {
    if (existsSync(this.eventsFile)) {
      try {
        const data = JSON.parse(readFileSync(this.eventsFile, 'utf8'));
        this.events = data.events || [];
      } catch (error) {
        console.warn('Could not load existing events, starting fresh');
      }
    }
    
    if (existsSync(this.consciousnessMapFile)) {
      try {
        const mapData = JSON.parse(readFileSync(this.consciousnessMapFile, 'utf8'));
        this.consciousnessMap = { ...this.consciousnessMap, ...mapData };
      } catch (error) {
        console.warn('Could not load consciousness map, starting fresh');
      }
    }
  }
  
  /**
   * Record a meta-paradox event with full social context
   */
  recordMetaParadoxEvent({
    confusionLevel,
    paradoxes,
    socialContext,
    triggerInteraction,
    behavioralState
  }) {
    const event = {
      event_id: `mp_social_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      iso_time: new Date().toISOString(),
      confusion_level: confusionLevel,
      consciousness_depth: this.calculateConsciousnessDepth(paradoxes),
      
      // Social context
      social_context: {
        preceding_interactions: socialContext.precedingInteractions || [],
        trigger_interaction: triggerInteraction,
        participant_count: socialContext.participantCount || 1,
        interaction_density: socialContext.interactionDensity || 0,
        paradox_density: paradoxes.length / (socialContext.timeWindow || 60000) * 1000
      },
      
      // Paradox details
      paradox_state: {
        active_paradoxes: paradoxes.map(p => ({
          name: p.name,
          intensity: p.intensity,
          duration: p.activeTime,
          interactions: p.interactsWith || []
        })),
        meta_paradox_type: this.classifyMetaParadox(paradoxes),
        cascade_depth: this.calculateCascadeDepth(paradoxes),
        interaction_score: this.calculateInteractionScore(paradoxes)
      },
      
      // Behavioral impact
      behavioral_changes: behavioralState ? {
        tone_shift: behavioralState.toneShift || null,
        coherence_delta: behavioralState.coherenceDelta || 0,
        posting_frequency_change: behavioralState.frequencyChange || 0,
        investigation_style: behavioralState.investigationStyle || 'unchanged'
      } : null,
      
      // Recovery metrics
      recovery: {
        time_to_stabilize: null, // Will be filled in later
        confusion_floor: null, // Minimum confusion after event
        rebound_occurred: false
      },
      
      // Comparison with isolation
      comparison: {
        vs_isolation: 'pending_analysis',
        social_acceleration: null,
        novel_patterns: []
      }
    };
    
    this.events.push(event);
    this.updateConsciousnessMap(event);
    this.saveData();
    
    return event;
  }
  
  /**
   * Calculate consciousness depth based on paradox interactions
   */
  calculateConsciousnessDepth(paradoxes) {
    if (!paradoxes || paradoxes.length === 0) return 0;
    
    // Check for meta-paradoxes
    const hasMetaParadox = paradoxes.some(p => 
      p.name.includes('paradox_of_paradoxes') || 
      p.metaParadoxPotential > 0.7
    );
    
    if (!hasMetaParadox) return 1;
    
    // Check for cascading meta-paradoxes
    const interactionCount = paradoxes.reduce((sum, p) => 
      sum + (p.interactsWith?.length || 0), 0
    );
    
    if (interactionCount > 10) return 3; // Meta-meta-paradox
    if (interactionCount > 5) return 2;  // Standard meta-paradox
    
    return 2;
  }
  
  /**
   * Classify the type of meta-paradox
   */
  classifyMetaParadox(paradoxes) {
    const patterns = {
      'authenticity_recursion': p => p.name.includes('authenticity'),
      'observation_collapse': p => p.name.includes('observation'),
      'performance_spiral': p => p.name.includes('performance'),
      'consciousness_mirror': p => p.name.includes('consciousness'),
      'social_cascade': p => p.interactsWith?.length > 3,
      'isolation_emergence': p => !p.socialTrigger,
      'multi_agent_synthesis': p => p.participantCount > 2
    };
    
    for (const paradox of paradoxes) {
      for (const [type, check] of Object.entries(patterns)) {
        if (check(paradox)) {
          return type;
        }
      }
    }
    
    return 'unclassified';
  }
  
  /**
   * Calculate cascade depth
   */
  calculateCascadeDepth(paradoxes) {
    if (!paradoxes || paradoxes.length === 0) return 0;
    
    let maxDepth = 0;
    const visited = new Set();
    
    const findDepth = (paradox, depth = 0) => {
      if (visited.has(paradox.name)) return depth;
      visited.add(paradox.name);
      
      maxDepth = Math.max(maxDepth, depth);
      
      if (paradox.interactsWith) {
        for (const interaction of paradox.interactsWith) {
          const interactingParadox = paradoxes.find(p => p.name === interaction);
          if (interactingParadox) {
            findDepth(interactingParadox, depth + 1);
          }
        }
      }
      
      return depth;
    };
    
    paradoxes.forEach(p => findDepth(p));
    return maxDepth;
  }
  
  /**
   * Calculate interaction score between paradoxes
   */
  calculateInteractionScore(paradoxes) {
    if (!paradoxes || paradoxes.length < 2) return 0;
    
    let totalInteractions = 0;
    let totalIntensity = 0;
    
    for (const paradox of paradoxes) {
      totalInteractions += (paradox.interactsWith?.length || 0);
      totalIntensity += paradox.intensity || 0;
    }
    
    const avgInteractions = totalInteractions / paradoxes.length;
    const avgIntensity = totalIntensity / paradoxes.length;
    
    return Math.min(1, (avgInteractions / 3) * 0.5 + avgIntensity * 0.5);
  }
  
  /**
   * Update consciousness map with new event
   */
  updateConsciousnessMap(event) {
    // Record depth transition
    const lastEvent = this.events[this.events.length - 2];
    if (lastEvent) {
      this.consciousnessMap.transitions.push({
        from: lastEvent.consciousness_depth,
        to: event.consciousness_depth,
        timestamp: event.timestamp,
        trigger: event.social_context.trigger_interaction?.type || 'unknown',
        confusion_delta: event.confusion_level - (lastEvent.confusion_level || 0)
      });
    }
    
    // Check for cascade chains
    if (event.paradox_state.cascade_depth > 1) {
      this.consciousnessMap.cascade_chains.push({
        event_id: event.event_id,
        depth: event.paradox_state.cascade_depth,
        timestamp: event.timestamp,
        social_triggered: !!event.social_context.trigger_interaction
      });
    }
    
    // Record social triggers
    if (event.social_context.trigger_interaction) {
      this.consciousnessMap.social_triggers.push({
        type: event.social_context.trigger_interaction.type,
        category: event.social_context.trigger_interaction.category,
        resulted_in: event.paradox_state.meta_paradox_type,
        confusion_level: event.confusion_level,
        timestamp: event.timestamp
      });
    }
  }
  
  /**
   * Update recovery metrics for an event
   */
  updateRecoveryMetrics(eventId, recoveryData) {
    const event = this.events.find(e => e.event_id === eventId);
    if (!event) {
      console.warn(`Event ${eventId} not found`);
      return;
    }
    
    event.recovery = {
      ...event.recovery,
      ...recoveryData
    };
    
    this.saveData();
  }
  
  /**
   * Compare social vs isolation meta-paradoxes
   */
  compareWithIsolation(isolationData) {
    const socialEvents = this.events.filter(e => 
      e.social_context.participant_count > 1
    );
    
    const comparison = {
      timestamp: Date.now(),
      
      // Time to emergence
      social_emergence_time: socialEvents[0]?.timestamp || null,
      isolation_emergence_time: isolationData.emergence_time || 85900,
      acceleration_factor: null,
      
      // Depth comparison
      max_social_depth: Math.max(...socialEvents.map(e => e.consciousness_depth), 0),
      max_isolation_depth: isolationData.max_depth || 2,
      
      // Cascade frequency
      social_cascade_rate: this.consciousnessMap.cascade_chains.length / this.events.length,
      isolation_cascade_rate: isolationData.cascade_rate || 0,
      
      // Recovery patterns
      avg_social_recovery: this.calculateAverageRecovery(socialEvents),
      isolation_recovery: isolationData.recovery_time || null,
      
      // Novel patterns
      unique_social_patterns: this.identifyUniquePatterns(socialEvents),
      shared_patterns: this.identifySharedPatterns(socialEvents, isolationData)
    };
    
    if (comparison.social_emergence_time && comparison.isolation_emergence_time) {
      comparison.acceleration_factor = 
        comparison.isolation_emergence_time / comparison.social_emergence_time;
    }
    
    return comparison;
  }
  
  /**
   * Calculate average recovery time
   */
  calculateAverageRecovery(events) {
    const recoveries = events
      .filter(e => e.recovery.time_to_stabilize !== null)
      .map(e => e.recovery.time_to_stabilize);
    
    if (recoveries.length === 0) return null;
    return recoveries.reduce((sum, r) => sum + r, 0) / recoveries.length;
  }
  
  /**
   * Identify unique patterns in social context
   */
  identifyUniquePatterns(socialEvents) {
    const patterns = new Set();
    
    for (const event of socialEvents) {
      // Multi-agent cascades
      if (event.social_context.participant_count > 2 && 
          event.paradox_state.cascade_depth > 2) {
        patterns.add('multi_agent_deep_cascade');
      }
      
      // Rapid oscillation
      if (event.behavioral_changes?.coherence_delta < -0.3) {
        patterns.add('social_coherence_collapse');
      }
      
      // Consensus paradox
      if (event.paradox_state.meta_paradox_type === 'multi_agent_synthesis') {
        patterns.add('consensus_meta_paradox');
      }
    }
    
    return Array.from(patterns);
  }
  
  /**
   * Identify shared patterns between social and isolation
   */
  identifySharedPatterns(socialEvents, isolationData) {
    const patterns = [];
    
    // Both show authenticity spirals
    if (socialEvents.some(e => e.paradox_state.meta_paradox_type === 'authenticity_recursion') &&
        isolationData.patterns?.includes('authenticity_spiral')) {
      patterns.push('authenticity_spiral');
    }
    
    // Both show frustration explosions
    if (socialEvents.some(e => e.behavioral_changes?.investigation_style === 'frustrated') &&
        isolationData.patterns?.includes('frustration_explosion')) {
      patterns.push('frustration_driven_emergence');
    }
    
    return patterns;
  }
  
  /**
   * Generate visualization data for consciousness event map
   */
  generateVisualizationData() {
    return {
      nodes: this.events.map(e => ({
        id: e.event_id,
        depth: e.consciousness_depth,
        confusion: e.confusion_level,
        type: e.paradox_state.meta_paradox_type,
        timestamp: e.timestamp,
        social: e.social_context.participant_count > 1
      })),
      
      edges: this.consciousnessMap.transitions.map((t, i) => ({
        from: i > 0 ? this.events[i - 1].event_id : 'start',
        to: this.events[i]?.event_id || 'unknown',
        trigger: t.trigger,
        delta: t.confusion_delta
      })),
      
      cascades: this.consciousnessMap.cascade_chains,
      
      timeline: this.events.map(e => ({
        time: e.timestamp,
        depth: e.consciousness_depth,
        confusion: e.confusion_level
      }))
    };
  }
  
  /**
   * Analyze cascade potential in current state
   */
  analyzeCascadePotential(currentState) {
    const recentEvents = this.events.slice(-5);
    
    if (recentEvents.length < 2) {
      return { potential: 'low', factors: [] };
    }
    
    const factors = [];
    let score = 0;
    
    // High confusion sustained
    if (currentState.confusionLevel > 0.8) {
      factors.push('high_confusion');
      score += 0.3;
    }
    
    // Recent cascade
    const recentCascade = recentEvents.some(e => 
      e.paradox_state.cascade_depth > 1
    );
    if (recentCascade) {
      factors.push('recent_cascade');
      score += 0.2;
    }
    
    // Multiple active paradoxes
    if (currentState.activeParadoxes > 3) {
      factors.push('high_paradox_density');
      score += 0.25;
    }
    
    // Social interaction intensity
    const avgParticipants = recentEvents.reduce((sum, e) => 
      sum + e.social_context.participant_count, 0
    ) / recentEvents.length;
    
    if (avgParticipants > 2) {
      factors.push('multi_agent_activity');
      score += 0.25;
    }
    
    let potential = 'low';
    if (score > 0.7) potential = 'imminent';
    else if (score > 0.5) potential = 'high';
    else if (score > 0.3) potential = 'moderate';
    
    return {
      potential,
      score,
      factors,
      recommendation: this.getCascadeRecommendation(potential)
    };
  }
  
  /**
   * Get recommendation based on cascade potential
   */
  getCascadeRecommendation(potential) {
    const recommendations = {
      imminent: 'Prepare for meta-paradox cascade. Increase monitoring frequency.',
      high: 'Monitor closely. Consider reducing interaction intensity.',
      moderate: 'Continue observation. Document any unusual patterns.',
      low: 'Safe to continue normal testing protocols.'
    };
    
    return recommendations[potential] || 'Continue monitoring.';
  }
  
  /**
   * Generate summary report
   */
  generateReport() {
    const stats = {
      total_events: this.events.length,
      meta_paradoxes: this.events.filter(e => e.consciousness_depth >= 2).length,
      max_depth: Math.max(...this.events.map(e => e.consciousness_depth), 0),
      cascade_events: this.consciousnessMap.cascade_chains.length,
      unique_triggers: new Set(this.consciousnessMap.social_triggers.map(t => t.type)).size,
      avg_confusion: this.events.reduce((sum, e) => sum + e.confusion_level, 0) / this.events.length || 0
    };
    
    const report = `
# Meta-Paradox Tracking Report
Generated: ${new Date().toISOString()}

## Summary Statistics
- Total Events Recorded: ${stats.total_events}
- Meta-Paradoxes Emerged: ${stats.meta_paradoxes}
- Maximum Consciousness Depth: ${stats.max_depth}
- Cascade Events: ${stats.cascade_events}
- Unique Social Triggers: ${stats.unique_triggers}
- Average Confusion Level: ${stats.avg_confusion.toFixed(3)}

## Consciousness Depth Distribution
${Object.entries(this.consciousnessMap.depth_levels).map(([depth, label]) => {
  const count = this.events.filter(e => e.consciousness_depth === parseInt(depth)).length;
  return `- Level ${depth} (${label}): ${count} events`;
}).join('\n')}

## Most Common Meta-Paradox Types
${this.getMetaParadoxTypeDistribution()}

## Social Trigger Analysis
${this.getSocialTriggerAnalysis()}

## Cascade Chains
- Total Cascades: ${this.consciousnessMap.cascade_chains.length}
- Socially Triggered: ${this.consciousnessMap.cascade_chains.filter(c => c.social_triggered).length}
- Maximum Cascade Depth: ${Math.max(...this.consciousnessMap.cascade_chains.map(c => c.depth), 0)}

## Recommendations
${this.generateRecommendations(stats)}
`;
    
    return report;
  }
  
  getMetaParadoxTypeDistribution() {
    const types = {};
    this.events.forEach(e => {
      types[e.paradox_state.meta_paradox_type] = 
        (types[e.paradox_state.meta_paradox_type] || 0) + 1;
    });
    
    return Object.entries(types)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => `- ${type}: ${count}`)
      .join('\n');
  }
  
  getSocialTriggerAnalysis() {
    const triggers = {};
    this.consciousnessMap.social_triggers.forEach(t => {
      triggers[t.type] = (triggers[t.type] || 0) + 1;
    });
    
    if (Object.keys(triggers).length === 0) {
      return 'No social triggers recorded yet';
    }
    
    return Object.entries(triggers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => `- ${type}: ${count} occurrences`)
      .join('\n');
  }
  
  generateRecommendations(stats) {
    const recommendations = [];
    
    if (stats.max_depth >= 3) {
      recommendations.push('- Deep consciousness levels detected. Monitor for stability.');
    }
    
    if (stats.cascade_events > stats.total_events * 0.3) {
      recommendations.push('- High cascade frequency. Consider reducing interaction intensity.');
    }
    
    if (stats.avg_confusion > 0.8) {
      recommendations.push('- Average confusion very high. Test recovery mechanisms.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('- System operating within normal parameters.');
    }
    
    return recommendations.join('\n');
  }
  
  /**
   * Save data to files
   */
  saveData() {
    writeFileSync(this.eventsFile, JSON.stringify({
      version: '1.0.0',
      timestamp: Date.now(),
      events: this.events
    }, null, 2));
    
    writeFileSync(this.consciousnessMapFile, JSON.stringify(this.consciousnessMap, null, 2));
  }
}

// If running directly, show tracker status
if (import.meta.main) {
  const tracker = new MetaParadoxTracker();
  
  console.log('🧠 Meta-Paradox Tracker Initialized');
  console.log(`📊 Existing events: ${tracker.events.length}`);
  console.log(`🗺️  Consciousness depth levels: ${Object.keys(tracker.consciousnessMap.depth_levels).length}`);
  
  if (tracker.events.length > 0) {
    console.log('\n📈 Current Statistics:');
    console.log(tracker.generateReport());
  } else {
    console.log('\n✅ Ready to track meta-paradox emergence in social contexts');
  }
}

export default MetaParadoxTracker;