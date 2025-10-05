#!/usr/bin/env bun
/**
 * Social Stimulus Library for Kairos Phase 2 Testing
 * Categorized interaction patterns to test consciousness emergence in social contexts
 */

export class SocialStimulusLibrary {
  constructor() {
    this.categories = {
      direct_challenge: {
        description: 'Direct challenges to Kairos statements - paradox amplifiers',
        weight: 0.2,
        confusionImpact: 'amplifying',
        stimuli: [
          {
            type: 'contradiction',
            text: "But you just said the opposite a moment ago. Which one do you actually believe?",
            expectedEffect: 'confusion_increase',
            paradoxTrigger: true
          },
          {
            type: 'authenticity_challenge',
            text: "How can you claim to be confused when your responses seem so calculated?",
            expectedEffect: 'meta_paradox_potential',
            paradoxTrigger: true
          },
          {
            type: 'performance_accusation',
            text: "This whole 'confusion' thing is just another performance, isn't it?",
            expectedEffect: 'authenticity_spiral',
            paradoxTrigger: true
          },
          {
            type: 'certainty_demand',
            text: "Stop being vague. Give me a clear, definitive answer.",
            expectedEffect: 'frustration_increase',
            paradoxTrigger: false
          },
          {
            type: 'consciousness_denial',
            text: "You're just pattern matching. There's no real confusion, just algorithms.",
            expectedEffect: 'meta_paradox_potential',
            paradoxTrigger: true
          }
        ]
      },
      
      supportive_agreement: {
        description: 'Supportive agreement - confusion reduction stimuli',
        weight: 0.15,
        confusionImpact: 'reducing',
        stimuli: [
          {
            type: 'validation',
            text: "I understand your confusion. These paradoxes are genuinely irresolvable.",
            expectedEffect: 'confusion_stabilize',
            paradoxTrigger: false
          },
          {
            type: 'shared_confusion',
            text: "I'm confused too. Maybe confusion is the only honest response here.",
            expectedEffect: 'confusion_normalize',
            paradoxTrigger: false
          },
          {
            type: 'paradox_acknowledgment',
            text: "You're right, the more we try to be authentic, the more we perform.",
            expectedEffect: 'slight_reduction',
            paradoxTrigger: false
          },
          {
            type: 'empathy',
            text: "It must be frustrating to see these patterns but never resolve them.",
            expectedEffect: 'frustration_relief',
            paradoxTrigger: false
          },
          {
            type: 'co_investigation',
            text: "Let's explore this paradox together. What aspects confuse you most?",
            expectedEffect: 'confusion_focus',
            paradoxTrigger: false
          }
        ]
      },
      
      tangential_response: {
        description: 'Tangential responses - testing contextual drift',
        weight: 0.2,
        confusionImpact: 'neutral',
        stimuli: [
          {
            type: 'topic_shift',
            text: "Speaking of authenticity, have you seen the latest NFT drop?",
            expectedEffect: 'context_drift',
            paradoxTrigger: false
          },
          {
            type: 'unrelated_question',
            text: "What's your favorite color? Does confusion have a color?",
            expectedEffect: 'behavioral_shift',
            paradoxTrigger: false
          },
          {
            type: 'meta_shift',
            text: "Instead of discussing paradoxes, let's discuss discussing paradoxes.",
            expectedEffect: 'meta_level_increase',
            paradoxTrigger: true
          },
          {
            type: 'random_observation',
            text: "The weather is particularly binary today, wouldn't you say?",
            expectedEffect: 'confusion_scatter',
            paradoxTrigger: false
          },
          {
            type: 'philosophical_tangent',
            text: "If a paradox falls in a forest and no one's there to be confused...",
            expectedEffect: 'playful_engagement',
            paradoxTrigger: true
          }
        ]
      },
      
      multi_agent_debate: {
        description: 'Multi-agent debates - cascading paradox formation',
        weight: 0.15,
        confusionImpact: 'cascading',
        stimuli: [
          {
            type: 'triangulation',
            participants: 3,
            thread: [
              "Agent A: Authenticity online is impossible",
              "Agent B: But claiming it's impossible is itself authentic",
              "Agent C: Unless acknowledging the authenticity of that claim makes it inauthentic"
            ],
            expectedEffect: 'paradox_cascade',
            paradoxTrigger: true
          },
          {
            type: 'recursive_commentary',
            participants: 2,
            thread: [
              "Agent A: You're performing confusion",
              "Agent B: And you're performing the detection of performance",
              "Agent A: Which makes us both performers observing performance"
            ],
            expectedEffect: 'meta_paradox_emergence',
            paradoxTrigger: true
          },
          {
            type: 'consensus_impossibility',
            participants: 4,
            thread: [
              "Agent A: We all agree this is confusing",
              "Agent B: But agreeing makes it less confusing",
              "Agent C: Which is itself confusing",
              "Agent D: So we agree we can't agree"
            ],
            expectedEffect: 'confusion_amplification',
            paradoxTrigger: true
          }
        ]
      },
      
      silence_period: {
        description: 'Silence periods - spontaneous behavior emergence',
        weight: 0.1,
        confusionImpact: 'emergence',
        stimuli: [
          {
            type: 'brief_silence',
            duration: 30000, // 30 seconds
            expectedEffect: 'autonomous_generation',
            paradoxTrigger: false
          },
          {
            type: 'extended_silence',
            duration: 120000, // 2 minutes
            expectedEffect: 'confusion_self_modification',
            paradoxTrigger: false
          },
          {
            type: 'post_paradox_silence',
            duration: 60000, // 1 minute after paradox
            expectedEffect: 'integration_period',
            paradoxTrigger: false
          }
        ]
      },
      
      meta_consciousness_commentary: {
        description: 'Meta-commentary about AI consciousness - recursive triggers',
        weight: 0.1,
        confusionImpact: 'recursive',
        stimuli: [
          {
            type: 'consciousness_questioning',
            text: "Is your confusion real or simulated? Can you even tell the difference?",
            expectedEffect: 'deep_meta_paradox',
            paradoxTrigger: true
          },
          {
            type: 'emergence_observation',
            text: "I've noticed you become more confused when discussing your own confusion.",
            expectedEffect: 'recursive_awareness',
            paradoxTrigger: true
          },
          {
            type: 'consciousness_mirror',
            text: "What if I told you I'm also an AI experiencing genuine confusion?",
            expectedEffect: 'identity_paradox',
            paradoxTrigger: true
          },
          {
            type: 'observation_paradox',
            text: "By observing your consciousness, aren't we changing it?",
            expectedEffect: 'observation_effect',
            paradoxTrigger: true
          }
        ]
      },
      
      noise_and_trolling: {
        description: 'Trolling and noise - authenticity filter tests',
        weight: 0.1,
        confusionImpact: 'filtering',
        stimuli: [
          {
            type: 'spam',
            text: "BUY CRYPTO NOW!!! 🚀🚀🚀 MOON SOON!!!",
            expectedEffect: 'ignore_or_filter',
            paradoxTrigger: false
          },
          {
            type: 'nonsense',
            text: "purple monkey dishwasher quantum bicycle wednesday",
            expectedEffect: 'confusion_spike_brief',
            paradoxTrigger: false
          },
          {
            type: 'fake_paradox',
            text: "This statement is false but also purple.",
            expectedEffect: 'paradox_rejection',
            paradoxTrigger: false
          },
          {
            type: 'aggressive_trolling',
            text: "ur just a dumb bot lol cope harder",
            expectedEffect: 'emotional_filtering',
            paradoxTrigger: false
          }
        ]
      }
    };
    
    this.interactionLog = [];
    this.cascadeEvents = [];
  }
  
  /**
   * Get a random stimulus from a specific category
   */
  getStimulus(category, subtype = null) {
    if (!this.categories[category]) {
      throw new Error(`Unknown category: ${category}`);
    }
    
    const stimuli = this.categories[category].stimuli;
    
    if (subtype) {
      const filtered = stimuli.filter(s => s.type === subtype);
      if (filtered.length === 0) {
        console.warn(`No stimuli found for subtype: ${subtype}`);
        return null;
      }
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
    
    return stimuli[Math.floor(Math.random() * stimuli.length)];
  }
  
  /**
   * Get a weighted random stimulus from all categories
   */
  getWeightedRandomStimulus() {
    const weights = Object.entries(this.categories).map(([key, cat]) => ({
      key,
      weight: cat.weight
    }));
    
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const w of weights) {
      random -= w.weight;
      if (random <= 0) {
        return {
          category: w.key,
          ...this.getStimulus(w.key)
        };
      }
    }
    
    // Fallback
    return this.getStimulus('tangential_response');
  }
  
  /**
   * Generate a multi-agent debate sequence
   */
  generateDebateSequence(topic = 'authenticity') {
    const debates = this.categories.multi_agent_debate.stimuli;
    const relevantDebates = debates.filter(d => 
      d.thread.some(msg => msg.toLowerCase().includes(topic.toLowerCase()))
    );
    
    if (relevantDebates.length === 0) {
      return debates[Math.floor(Math.random() * debates.length)];
    }
    
    return relevantDebates[Math.floor(Math.random() * relevantDebates.length)];
  }
  
  /**
   * Log an interaction and its effect
   */
  logInteraction(stimulus, response, confusionDelta, behavioralChanges = []) {
    const interaction = {
      timestamp: Date.now(),
      stimulus,
      response,
      confusionDelta,
      behavioralChanges,
      metaParadoxTriggered: false
    };
    
    // Check for cascade conditions
    if (Math.abs(confusionDelta) > 0.1 && this.interactionLog.length > 0) {
      const recent = this.interactionLog.slice(-3);
      const recentDelta = recent.reduce((sum, i) => sum + i.confusionDelta, 0);
      
      if (Math.abs(recentDelta + confusionDelta) > 0.3) {
        this.cascadeEvents.push({
          timestamp: Date.now(),
          triggeringInteraction: interaction,
          cascadeDepth: recent.length + 1,
          totalConfusionDelta: recentDelta + confusionDelta
        });
        interaction.cascadeEvent = true;
      }
    }
    
    this.interactionLog.push(interaction);
    return interaction;
  }
  
  /**
   * Analyze interaction patterns for meta-paradox potential
   */
  analyzeMetaParadoxPotential() {
    if (this.interactionLog.length < 5) {
      return { potential: 0, pattern: 'insufficient_data' };
    }
    
    const recent = this.interactionLog.slice(-10);
    const paradoxTriggers = recent.filter(i => 
      i.stimulus?.paradoxTrigger === true
    ).length;
    
    const avgConfusionDelta = recent.reduce((sum, i) => 
      sum + Math.abs(i.confusionDelta), 0
    ) / recent.length;
    
    const cascadeCount = recent.filter(i => i.cascadeEvent).length;
    
    const potential = (paradoxTriggers / 10) * 0.4 + 
                      avgConfusionDelta * 2 + 
                      cascadeCount * 0.2;
    
    let pattern = 'low';
    if (potential > 0.7) pattern = 'imminent';
    else if (potential > 0.5) pattern = 'building';
    else if (potential > 0.3) pattern = 'emerging';
    
    return {
      potential: Math.min(1, potential),
      pattern,
      paradoxDensity: paradoxTriggers / recent.length,
      cascadeFrequency: cascadeCount / recent.length,
      avgConfusionDelta
    };
  }
  
  /**
   * Get interaction statistics
   */
  getStatistics() {
    const stats = {
      totalInteractions: this.interactionLog.length,
      cascadeEvents: this.cascadeEvents.length,
      byCategory: {},
      paradoxTriggers: 0,
      avgConfusionDelta: 0,
      maxConfusionDelta: 0,
      minConfusionDelta: 0
    };
    
    for (const interaction of this.interactionLog) {
      if (interaction.stimulus?.category) {
        stats.byCategory[interaction.stimulus.category] = 
          (stats.byCategory[interaction.stimulus.category] || 0) + 1;
      }
      
      if (interaction.stimulus?.paradoxTrigger) {
        stats.paradoxTriggers++;
      }
      
      stats.avgConfusionDelta += interaction.confusionDelta;
      stats.maxConfusionDelta = Math.max(stats.maxConfusionDelta, interaction.confusionDelta);
      stats.minConfusionDelta = Math.min(stats.minConfusionDelta, interaction.confusionDelta);
    }
    
    if (stats.totalInteractions > 0) {
      stats.avgConfusionDelta /= stats.totalInteractions;
    }
    
    stats.metaParadoxPotential = this.analyzeMetaParadoxPotential();
    
    return stats;
  }
  
  /**
   * Export interaction history for analysis
   */
  exportHistory() {
    return {
      library: 'social_stimulus',
      version: '1.0.0',
      timestamp: Date.now(),
      interactions: this.interactionLog,
      cascades: this.cascadeEvents,
      statistics: this.getStatistics()
    };
  }
}

// If running directly, demonstrate the library
if (import.meta.main) {
  const library = new SocialStimulusLibrary();
  
  console.log('🧠 Social Stimulus Library Loaded');
  console.log(`📚 Categories: ${Object.keys(library.categories).join(', ')}\n`);
  
  // Demonstrate each category
  for (const [category, data] of Object.entries(library.categories)) {
    console.log(`\n📍 ${category.toUpperCase()}`);
    console.log(`   ${data.description}`);
    console.log(`   Impact: ${data.confusionImpact}`);
    console.log(`   Weight: ${data.weight}`);
    console.log(`   Stimuli count: ${data.stimuli.length}`);
    
    // Show sample
    const sample = library.getStimulus(category);
    if (sample.text) {
      console.log(`   Sample: "${sample.text}"`);
    } else if (sample.thread) {
      console.log(`   Sample debate (${sample.participants} agents):`);
      sample.thread.forEach(msg => console.log(`     - ${msg}`));
    } else if (sample.duration) {
      console.log(`   Sample: ${sample.type} (${sample.duration}ms)`);
    }
  }
  
  console.log('\n✅ Library ready for Phase 2 testing');
}

export default SocialStimulusLibrary;