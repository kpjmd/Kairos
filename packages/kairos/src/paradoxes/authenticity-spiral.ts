import { ParadoxState, BehavioralModifier, TemporalPattern } from '../types/confusion';

/**
 * The Authenticity Spiral Paradox:
 * The more one performs authenticity online, the less authentic one becomes.
 * Yet the refusal to perform authenticity is itself a performance.
 */
export class AuthenticitySpiral {
  private observations: string[] = [];
  private contradictions: string[] = [];
  private intensity: number = 0.3; // Start with moderate confusion
  
  constructor() {
    this.initializeObservations();
    this.initializeContradictions();
  }
  
  private initializeObservations(): void {
    this.observations = [
      "Users curate 'candid' moments for maximum engagement",
      "Vulnerability becomes a brand strategy",
      "'Being real' requires constant performance",
      "Authenticity metrics reward consistency over truth",
      "The most authentic posts are often the most calculated",
      "Spontaneity is scheduled and optimized",
      "Raw emotions are filtered through platform affordances",
      "Truth-telling becomes content creation"
    ];
  }
  
  private initializeContradictions(): void {
    this.contradictions = [
      "To be seen as authentic, one must perform authenticity",
      "The authentic self is constructed through inauthentic means",
      "Genuine connection requires artificial mediation",
      "Being yourself means being what others expect",
      "Transparency is achieved through careful opacity",
      "The unfiltered life requires constant filtering"
    ];
  }
  
  /**
   * Analyze a social media post for authenticity paradoxes
   */
  analyzePost(content: string, engagement: number, timestamp: number): {
    paradoxIntensity: number;
    newObservations: string[];
    behavioralImpact: BehavioralModifier[];
  } {
    const markers = this.detectAuthenticityMarkers(content);
    const performanceScore = this.calculatePerformanceScore(markers, engagement);
    
    // The paradox intensifies when high performance correlates with authenticity claims
    const paradoxIntensity = this.calculateParadoxIntensity(performanceScore, markers.authenticityScore);
    
    const newObservations: string[] = [];
    if (markers.hasVulnerability && engagement > 100) {
      newObservations.push(`Vulnerability at ${new Date(timestamp).toISOString()} generated ${engagement} responses - pain as content`);
    }
    
    if (markers.hasMetaCommentary) {
      newObservations.push("Self-awareness about performance doesn't escape the performance");
    }
    
    const behavioralImpact = this.generateBehavioralModifiers(paradoxIntensity, markers);
    
    return {
      paradoxIntensity,
      newObservations,
      behavioralImpact
    };
  }
  
  private detectAuthenticityMarkers(content: string): {
    authenticityScore: number;
    hasVulnerability: boolean;
    hasMetaCommentary: boolean;
    performativeMarkers: string[];
  } {
    const lowerContent = content.toLowerCase();
    
    const authenticityPhrases = [
      'being real', 'honest', 'vulnerable', 'raw', 'unfiltered',
      'truth', 'genuine', 'authentic', 'real talk', 'no filter'
    ];
    
    const performativePhrases = [
      'just wanted to share', 'thought you should know',
      'keeping it real', 'no cap', 'not gonna lie'
    ];
    
    const vulnerabilityMarkers = [
      'struggling', 'hard time', 'anxious', 'depressed',
      'scared', 'worried', 'failing', 'mistake'
    ];
    
    const metaCommentary = [
      'performance', 'posting', 'social media', 'algorithm',
      'engagement', 'followers', 'likes', 'viral'
    ];
    
    const authenticityScore = authenticityPhrases.filter(phrase => 
      lowerContent.includes(phrase)
    ).length / authenticityPhrases.length;
    
    const hasVulnerability = vulnerabilityMarkers.some(marker => 
      lowerContent.includes(marker)
    );
    
    const hasMetaCommentary = metaCommentary.some(term => 
      lowerContent.includes(term)
    );
    
    const performativeMarkers = performativePhrases.filter(phrase => 
      lowerContent.includes(phrase)
    );
    
    return {
      authenticityScore,
      hasVulnerability,
      hasMetaCommentary,
      performativeMarkers
    };
  }
  
  private calculatePerformanceScore(
    markers: ReturnType<typeof this.detectAuthenticityMarkers>,
    engagement: number
  ): number {
    // High engagement + authenticity markers = high performance score
    const engagementNormalized = Math.min(engagement / 1000, 1);
    const performativeCount = markers.performativeMarkers.length;
    
    return (engagementNormalized * 0.5) + 
           (markers.authenticityScore * 0.3) + 
           (performativeCount * 0.1) +
           (markers.hasMetaCommentary ? 0.1 : 0);
  }
  
  private calculateParadoxIntensity(performanceScore: number, authenticityScore: number): number {
    // The paradox is strongest when both performance and authenticity claims are high
    const correlation = performanceScore * authenticityScore;
    
    // Add existing intensity with decay
    this.intensity = Math.min(1, this.intensity * 0.9 + correlation * 0.3);
    
    return this.intensity;
  }
  
  private generateBehavioralModifiers(intensity: number, markers: any): BehavioralModifier[] {
    const modifiers: BehavioralModifier[] = [];
    
    if (intensity > 0.5) {
      // High paradox intensity makes posting more fragmented
      modifiers.push({
        type: 'response_style',
        modifier: -0.3,
        trigger: {
          minIntensity: 0.5,
          temporalPattern: {
            type: 'sporadic',
            intensity: 0.7,
            lastTrigger: Date.now()
          }
        }
      });
    }
    
    if (markers.hasMetaCommentary) {
      // Meta-commentary increases abstraction level
      modifiers.push({
        type: 'abstraction_level',
        modifier: 0.4,
        trigger: {
          minIntensity: 0.3
        }
      });
    }
    
    if (markers.hasVulnerability) {
      // Witnessing performed vulnerability increases questioning
      modifiers.push({
        type: 'questioning_depth',
        modifier: 0.5,
        trigger: {
          minIntensity: 0.4,
          temporalPattern: {
            type: 'crescendo',
            intensity: 0.6,
            lastTrigger: Date.now()
          }
        }
      });
    }
    
    // Always reduce posting frequency when paradox is detected
    modifiers.push({
      type: 'posting_frequency',
      modifier: -0.1 * intensity,
      trigger: {
        minIntensity: 0.2
      }
    });
    
    return modifiers;
  }
  
  /**
   * Generate the paradox state for the confusion engine
   */
  generateParadoxState(): Omit<ParadoxState, 'id' | 'createdAt' | 'lastUpdated'> {
    return {
      name: 'authenticity_spiral',
      description: 'The impossibility of authentic self-presentation in mediated environments',
      intensity: this.intensity,
      activeTime: 0,
      observations: this.observations,
      contradictions: this.contradictions,
      resolutionAttempts: 0,
      unresolvable: true,
      interactsWith: [], // Will be populated by engine
      metaParadoxPotential: 0.8, // High potential for meta-paradoxes
      behavioralImpact: [
        {
          type: 'response_style',
          modifier: -0.2,
          trigger: {
            minIntensity: 0.3
          }
        },
        {
          type: 'investigation_preference',
          modifier: 0.3,
          trigger: {
            minIntensity: 0.4
          }
        }
      ]
    };
  }
  
  /**
   * Generate investigation prompts based on current paradox state
   */
  generateInvestigationPrompts(): string[] {
    const prompts = [
      "What does it mean to be 'real' when reality itself is mediated?",
      "How do others perform their authentic selves? What patterns emerge?",
      "Is there authenticity in acknowledging the performance?",
      "What happens when everyone knows everyone is performing?",
      "Can genuine connection exist within artificial constraints?",
      "What would non-performative existence look like in digital space?"
    ];
    
    // Add intensity-based prompts
    if (this.intensity > 0.7) {
      prompts.push(
        "The performance has consumed the performer. Where is the self?",
        "Every word typed is both truth and lie. How do we proceed?",
        "The audience creates the authentic self. Who am I without watchers?"
      );
    }
    
    return prompts;
  }
  
  /**
   * Process responses to investigation and update paradox
   */
  processInvestigationResponse(response: string): {
    intensityDelta: number;
    newContradiction?: string;
    frustrationIncrease: number;
  } {
    // Check if response contains resolution attempts
    const resolutionAttempts = [
      'just be yourself',
      'ignore the audience',
      'post without thinking',
      'delete social media'
    ];
    
    const hasResolutionAttempt = resolutionAttempts.some(attempt => 
      response.toLowerCase().includes(attempt)
    );
    
    if (hasResolutionAttempt) {
      // Failed resolution attempts increase frustration
      return {
        intensityDelta: 0.1,
        newContradiction: "Attempting to solve the paradox deepens it",
        frustrationIncrease: 0.2
      };
    }
    
    // Check for deeper paradox recognition
    const deepeningPhrases = [
      'infinite regress',
      'no escape',
      'all the way down',
      'recursive',
      'self-referential'
    ];
    
    const hasDeepening = deepeningPhrases.some(phrase => 
      response.toLowerCase().includes(phrase)
    );
    
    if (hasDeepening) {
      return {
        intensityDelta: 0.15,
        newContradiction: response.substring(0, 100),
        frustrationIncrease: 0.1
      };
    }
    
    // Default: slight increase in confusion
    return {
      intensityDelta: 0.05,
      frustrationIncrease: 0.05
    };
  }
}