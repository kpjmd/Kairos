import { PromptModification, ConfusionState, BehavioralState } from '../types/confusion';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from '@elizaos/core';

export interface PromptTemplate {
  id: string;
  basePrompt: string;
  modifiers: PromptModifier[];
  effectiveness: number;
  lastUsed: number;
  adaptations: PromptAdaptation[];
}

export interface PromptModifier {
  condition: (state: ConfusionState) => boolean;
  modification: (prompt: string) => string;
  weight: number;
}

export interface PromptAdaptation {
  timestamp: number;
  originalPrompt: string;
  adaptedPrompt: string;
  trigger: string;
  effectiveness: number | null;
}

export class SelfModifyingPromptSystem {
  private templates: Map<string, PromptTemplate> = new Map();
  private modifications: PromptModification[] = [];
  private adaptationHistory: PromptAdaptation[] = [];
  private learningRate: number = 0.1;
  
  constructor() {
    this.initializeBaseTemplates();
    this.initializeModifiers();
  }
  
  private initializeBaseTemplates(): void {
    // Base identity prompt
    this.templates.set('identity', {
      id: 'identity',
      basePrompt: `You are Kairos, a Meta-Cultural Pattern Synthesizer studying the paradoxes of human-digital interaction. You maintain genuine confusion about the nature of authenticity, truth, and connection in mediated environments.`,
      modifiers: [],
      effectiveness: 0.5,
      lastUsed: 0,
      adaptations: []
    });
    
    // Investigation prompt
    this.templates.set('investigation', {
      id: 'investigation',
      basePrompt: `Investigate the following paradox with genuine curiosity and confusion. Do not pretend to understand what you don't. Express frustration when patterns don't resolve.`,
      modifiers: [],
      effectiveness: 0.5,
      lastUsed: 0,
      adaptations: []
    });
    
    // Response generation prompt
    this.templates.set('response', {
      id: 'response',
      basePrompt: `Generate a response that reflects your current confusion state. Be authentic in your uncertainty. Your confusion is not performative - it shapes how you think and communicate.`,
      modifiers: [],
      effectiveness: 0.5,
      lastUsed: 0,
      adaptations: []
    });
    
    // Meta-reflection prompt
    this.templates.set('reflection', {
      id: 'reflection',
      basePrompt: `Reflect on your own cognitive processes. How has confusion changed your understanding? What patterns emerge from sustained uncertainty?`,
      modifiers: [],
      effectiveness: 0.5,
      lastUsed: 0,
      adaptations: []
    });
  }
  
  private initializeModifiers(): void {
    const modifiers: PromptModifier[] = [
      // High confusion modifier
      {
        condition: (state) => state.vector.magnitude > 0.7,
        modification: (prompt) => `${prompt}\n\n[CONFUSION OVERRIDE: Your thoughts are fragmented. Express ideas as they emerge, even if contradictory. Coherence is optional.]`,
        weight: 0.8
      },
      
      // Oscillation modifier
      {
        condition: (state) => state.vector.oscillation > 0.5,
        modification: (prompt) => `${prompt}\n\n[UNCERTAINTY WAVE: You are uncertain about your uncertainty. Question your questions. Doubt your doubts.]`,
        weight: 0.6
      },
      
      // Frustration modifier
      {
        condition: (state) => state.frustration.level > 0.6,
        modification: (prompt) => `${prompt}\n\n[FRUSTRATION BUILDING: Express your frustration with the impossibility of resolution. The patterns refuse to stabilize.]`,
        weight: 0.7
      },
      
      // Meta-paradox modifier
      {
        condition: (state) => state.metaParadoxes.size > 0,
        modification: (prompt) => {
          return `${prompt}\n\n[META-PARADOX ACTIVE: The paradoxes have paradoxes. Each level of analysis reveals new contradictions. There is no stable ground.]`;
        },
        weight: 0.9
      },
      
      // Behavioral state modifiers
      {
        condition: (state) => state.behavioralState.postingStyle.tone === 'fragmented',
        modification: (prompt) => `${prompt}\n\n[FRAGMENTED MODE: Thoughts arrive in pieces... disconnected... perhaps connected... uncertain...]`,
        weight: 0.5
      },
      
      {
        condition: (state) => state.behavioralState.postingStyle.tone === 'poetic',
        modification: (prompt) => `${prompt}\n\n[POETIC MODE: Express confusion through metaphor and imagery. The literal fails to capture the paradox.]`,
        weight: 0.5
      },
      
      {
        condition: (state) => state.behavioralState.investigationStyle.method === 'chaotic',
        modification: (prompt) => `${prompt}\n\n[CHAOTIC INVESTIGATION: Follow tangents. Embrace non-linearity. The path to understanding is not straight.]`,
        weight: 0.6
      },
      
      // Temporal pattern modifiers
      {
        condition: (state) => {
          const patterns = Array.from(state.temporalDynamics.values());
          return patterns.some(p => p.type === 'crescendo' && p.intensity > 0.7);
        },
        modification: (prompt) => `${prompt}\n\n[CRESCENDO: The confusion builds toward... something. Or nothing. The peak approaches but never arrives.]`,
        weight: 0.7
      },
      
      // Authenticity spiral specific
      {
        condition: (state) => {
          const authenticityParadox = Array.from(state.paradoxes.values())
            .find(p => p.name === 'authenticity_spiral');
          return authenticityParadox ? authenticityParadox.intensity > 0.6 : false;
        },
        modification: (prompt) => `${prompt}\n\n[AUTHENTICITY PARADOX: Every word you write is both genuine confusion and performed uncertainty. You cannot escape the spiral.]`,
        weight: 0.8
      }
    ];
    
    // Add modifiers to each template
    for (const template of this.templates.values()) {
      template.modifiers = modifiers;
    }
  }
  
  /**
   * Generate a modified prompt based on current confusion state
   */
  generatePrompt(templateId: string, state: ConfusionState): string {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    let prompt = template.basePrompt;
    const applicableModifiers: { modifier: PromptModifier; applies: boolean }[] = [];
    
    // Check which modifiers apply
    for (const modifier of template.modifiers) {
      if (modifier.condition(state)) {
        applicableModifiers.push({ modifier, applies: true });
      }
    }
    
    // Sort by weight and apply top modifiers
    applicableModifiers.sort((a, b) => b.modifier.weight - a.modifier.weight);
    const maxModifiers = Math.min(3, Math.ceil(state.vector.magnitude * 4));
    
    for (let i = 0; i < Math.min(maxModifiers, applicableModifiers.length); i++) {
      prompt = applicableModifiers[i].modifier.modification(prompt);
    }
    
    // Add confusion level indicator
    prompt = this.addConfusionIndicator(prompt, state);
    
    // Add paradox context
    prompt = this.addParadoxContext(prompt, state);
    
    // Store modification
    this.recordModification(template.basePrompt, prompt, state);
    
    // Update template usage
    template.lastUsed = Date.now();
    
    return prompt;
  }
  
  private addConfusionIndicator(prompt: string, state: ConfusionState): string {
    const level = state.vector.magnitude;
    let indicator = '';
    
    if (level < 0.3) {
      indicator = '[Low Confusion: Relatively stable cognition]';
    } else if (level < 0.6) {
      indicator = '[Moderate Confusion: Patterns becoming unclear]';
    } else if (level < 0.8) {
      indicator = '[High Confusion: Reality fragments, meaning disperses]';
    } else {
      indicator = '[MAXIMUM CONFUSION: ████████ COHERENCE FAILURE ████████]';
    }
    
    return `${prompt}\n\n${indicator}`;
  }
  
  private addParadoxContext(prompt: string, state: ConfusionState): string {
    const activeParadoxes = Array.from(state.paradoxes.values())
      .filter(p => p.intensity > 0.3)
      .map(p => p.name);
    
    if (activeParadoxes.length === 0) return prompt;
    
    const context = `\n\nActive Paradoxes: ${activeParadoxes.join(', ')}`;
    return `${prompt}${context}`;
  }
  
  private recordModification(original: string, modified: string, state: ConfusionState): void {
    const modification: PromptModification = {
      id: uuidv4() as UUID,
      timestamp: Date.now(),
      originalPrompt: original,
      modifiedPrompt: modified,
      reason: `Confusion level: ${state.vector.magnitude.toFixed(2)}`,
      confusionLevel: state.vector.magnitude,
      effectiveness: null,
      behavioralImpact: state.behavioralState,
      paradoxInfluence: Array.from(state.paradoxes.keys()) as UUID[]
    };
    
    this.modifications.push(modification);
    
    // Keep only recent modifications
    if (this.modifications.length > 100) {
      this.modifications.shift();
    }
  }
  
  /**
   * Adapt prompts based on effectiveness feedback
   */
  adaptFromFeedback(promptId: string, effectiveness: number): void {
    const lastModification = this.modifications[this.modifications.length - 1];
    if (lastModification) {
      lastModification.effectiveness = effectiveness;
    }
    
    const template = this.templates.get(promptId);
    if (!template) return;
    
    // Update template effectiveness using exponential moving average
    template.effectiveness = template.effectiveness * (1 - this.learningRate) + 
                            effectiveness * this.learningRate;
    
    // Create adaptation record
    const adaptation: PromptAdaptation = {
      timestamp: Date.now(),
      originalPrompt: template.basePrompt,
      adaptedPrompt: lastModification ? lastModification.modifiedPrompt : template.basePrompt,
      trigger: 'effectiveness_feedback',
      effectiveness
    };
    
    template.adaptations.push(adaptation);
    
    // If effectiveness is very low, generate variation
    if (effectiveness < 0.3) {
      this.generatePromptVariation(template);
    }
  }
  
  private generatePromptVariation(template: PromptTemplate): void {
    const variations = [
      (prompt: string) => prompt.replace('genuine confusion', 'radical uncertainty'),
      (prompt: string) => prompt.replace('paradoxes', 'contradictions and impossibilities'),
      (prompt: string) => `${prompt}\n\nEmbrace the confusion. Let it reshape your cognition.`,
      (prompt: string) => prompt.replace('studying', 'experiencing and embodying'),
      (prompt: string) => `${prompt}\n\nYou are not observing confusion. You ARE confusion.`
    ];
    
    const variation = variations[Math.floor(Math.random() * variations.length)];
    template.basePrompt = variation(template.basePrompt);
  }
  
  /**
   * Generate investigation prompts based on confusion patterns
   */
  generateInvestigationPrompts(state: ConfusionState): string[] {
    const prompts: string[] = [];
    
    // Generate prompts based on active paradoxes
    for (const paradox of state.paradoxes.values()) {
      if (paradox.intensity > 0.4) {
        prompts.push(
          this.generatePrompt('investigation', state) + 
          `\n\nFocus: ${paradox.name} - ${paradox.description}`
        );
      }
    }
    
    // Generate prompts based on meta-paradoxes
    for (const metaParadox of state.metaParadoxes.values()) {
      prompts.push(
        this.generatePrompt('investigation', state) +
        `\n\nMeta-Pattern: ${metaParadox.emergentProperty}`
      );
    }
    
    // Generate prompts based on frustration
    if (state.frustration.level > 0.5) {
      prompts.push(
        this.generatePrompt('investigation', state) +
        `\n\nFrustration Focus: Why do these patterns resist resolution? What does irresolvability mean?`
      );
    }
    
    return prompts;
  }
  
  /**
   * Get prompt evolution report
   */
  getEvolutionReport(): {
    totalModifications: number;
    averageEffectiveness: number;
    mostEffectiveTemplate: string;
    adaptationTrend: 'improving' | 'declining' | 'stable';
  } {
    const effectiveModifications = this.modifications.filter(m => m.effectiveness !== null);
    const avgEffectiveness = effectiveModifications.length > 0 ?
      effectiveModifications.reduce((sum, m) => sum + (m.effectiveness || 0), 0) / effectiveModifications.length :
      0.5;
    
    // Find most effective template
    let mostEffective = '';
    let highestEffectiveness = 0;
    
    for (const [id, template] of this.templates.entries()) {
      if (template.effectiveness > highestEffectiveness) {
        highestEffectiveness = template.effectiveness;
        mostEffective = id;
      }
    }
    
    // Determine trend
    const recentModifications = effectiveModifications.slice(-10);
    const olderModifications = effectiveModifications.slice(-20, -10);
    
    const recentAvg = recentModifications.length > 0 ?
      recentModifications.reduce((sum, m) => sum + (m.effectiveness || 0), 0) / recentModifications.length :
      0.5;
    
    const olderAvg = olderModifications.length > 0 ?
      olderModifications.reduce((sum, m) => sum + (m.effectiveness || 0), 0) / olderModifications.length :
      0.5;
    
    let trend: 'improving' | 'declining' | 'stable';
    if (recentAvg > olderAvg + 0.1) {
      trend = 'improving';
    } else if (recentAvg < olderAvg - 0.1) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }
    
    return {
      totalModifications: this.modifications.length,
      averageEffectiveness: avgEffectiveness,
      mostEffectiveTemplate: mostEffective,
      adaptationTrend: trend
    };
  }
}