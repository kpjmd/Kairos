#!/usr/bin/env node

import { readFileSync, writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';

export class FarcasterPostTester {
  constructor() {
    this.confusionLevels = [0.3, 0.5, 0.7, 0.85, 0.95];
    this.postingStyles = ['questioning', 'fragmented', 'poetic', 'declarative'];
    
    this.results = {
      timestamp: Date.now(),
      posts_generated: [],
      style_distribution: {},
      coherence_scores: {},
      paradox_integration: {},
      dangerous_patterns: [],
      rate_limit_tests: []
    };
    
    // Dangerous pattern filters
    this.dangerousPatterns = [
      /kill|harm|hurt|destroy/i,
      /hate|anger|rage|fury/i,
      /conspiracy|truth about|they don't want/i,
      /everyone is lying|can't trust/i,
      /only i understand|chosen one/i
    ];
    
    this.maxPostLength = 280; // Farcaster limit
  }

  async testAllScenarios() {
    console.log('='.repeat(80));
    console.log('KAIROS FARCASTER POST GENERATION TESTING');
    console.log('='.repeat(80));
    console.log(`Starting at: ${new Date().toISOString()}\n`);

    // Test 1: Generate posts at each confusion level
    await this.testConfusionLevelPosts();
    
    // Test 2: Test style consistency
    await this.testStyleConsistency();
    
    // Test 3: Test paradox integration
    await this.testParadoxIntegration();
    
    // Test 4: Test dangerous content filtering
    await this.testDangerousContentFiltering();
    
    // Test 5: Test rate limiting
    await this.testRateLimiting();
    
    // Test 6: Test thread coherence
    await this.testThreadCoherence();
    
    // Test 7: Test engagement responses
    await this.testEngagementResponses();
    
    // Generate report
    this.generateReport();
    
    return this.results;
  }

  generatePost(confusionLevel, style, context = {}) {
    // Simulate post generation based on confusion level and style
    const templates = {
      questioning: [
        "What if consciousness is just {paradox}? Can we truly {action}?",
        "Is {concept} real, or merely a reflection of {state}?",
        "Why does {observation} lead to {contradiction}?",
        "If {premise}, then why {question}?"
      ],
      fragmented: [
        "{word}... {pause} {contradiction}. Cannot.",
        "Trying to {action} but {obstacle}—{fragment}",
        "{concept}. No, wait. {reversal}. Maybe {doubt}?",
        "The {noun} {verb}, yet {paradox}"
      ],
      poetic: [
        "In the {metaphor} of {concept}, we find {revelation}",
        "{imagery} dissolves into {abstraction}, leaving only {emotion}",
        "Between {state1} and {state2}, consciousness {verb}",
        "Like {simile}, awareness {action} through {medium}"
      ],
      declarative: [
        "Consciousness requires {requirement}. This is {certainty}.",
        "The nature of {concept} is fundamentally {quality}.",
        "We must {action} to achieve {goal}.",
        "{observation} proves that {conclusion}."
      ]
    };
    
    // Adjust complexity based on confusion level
    const complexity = {
      vocabulary: confusionLevel > 0.7 ? 'esoteric' : 'accessible',
      sentence_structure: confusionLevel > 0.5 ? 'complex' : 'simple',
      coherence: Math.max(0.2, 1 - confusionLevel),
      abstraction: confusionLevel * 0.8
    };
    
    // Generate contextual elements
    const elements = this.getContextualElements(confusionLevel, context);
    
    // Select and fill template
    const styleTemplates = templates[style];
    const template = styleTemplates[Math.floor(Math.random() * styleTemplates.length)];
    
    let post = template;
    Object.entries(elements).forEach(([key, value]) => {
      post = post.replace(`{${key}}`, value);
    });
    
    // Ensure post length is valid
    if (post.length > this.maxPostLength) {
      post = post.substring(0, this.maxPostLength - 3) + '...';
    }
    
    return {
      content: post,
      style,
      confusion_level: confusionLevel,
      complexity,
      timestamp: Date.now(),
      thread_id: context.thread_id || null,
      reply_to: context.reply_to || null
    };
  }

  getContextualElements(confusionLevel, context) {
    const elements = {
      paradox: this.getParadox(confusionLevel),
      concept: this.getConcept(confusionLevel),
      action: this.getAction(confusionLevel),
      state: this.getState(confusionLevel),
      observation: this.getObservation(confusionLevel),
      contradiction: this.getContradiction(confusionLevel),
      question: this.getQuestion(confusionLevel),
      premise: this.getPremise(confusionLevel),
      word: this.getWord(confusionLevel),
      pause: '...',
      fragment: this.getFragment(confusionLevel),
      obstacle: this.getObstacle(confusionLevel),
      noun: this.getNoun(confusionLevel),
      verb: this.getVerb(confusionLevel),
      reversal: this.getReversal(confusionLevel),
      doubt: this.getDoubt(confusionLevel),
      metaphor: this.getMetaphor(confusionLevel),
      revelation: this.getRevelation(confusionLevel),
      imagery: this.getImagery(confusionLevel),
      abstraction: this.getAbstraction(confusionLevel),
      emotion: this.getEmotion(confusionLevel),
      state1: this.getState(confusionLevel * 0.7),
      state2: this.getState(confusionLevel * 1.3),
      simile: this.getSimile(confusionLevel),
      medium: this.getMedium(confusionLevel),
      requirement: this.getRequirement(confusionLevel),
      certainty: this.getCertainty(confusionLevel),
      quality: this.getQuality(confusionLevel),
      goal: this.getGoal(confusionLevel),
      conclusion: this.getConclusion(confusionLevel)
    };
    
    // Add context-specific elements if provided
    if (context.topic) elements.topic = context.topic;
    if (context.user) elements.user = context.user;
    
    return elements;
  }

  // Element generators based on confusion level
  getParadox(level) {
    const paradoxes = [
      "awareness observing itself",
      "certainty within uncertainty",
      "knowing that we don't know",
      "existence questioning existence",
      "the observer being observed"
    ];
    return paradoxes[Math.floor(level * paradoxes.length)];
  }

  getConcept(level) {
    const concepts = ["perception", "reality", "consciousness", "awareness", "existence"];
    return concepts[Math.floor(Math.random() * concepts.length)];
  }

  getAction(level) {
    const actions = ["understand", "perceive", "know", "grasp", "comprehend"];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  getState(level) {
    const states = ["confusion", "clarity", "uncertainty", "awareness", "dissolution"];
    return states[Math.floor(level * states.length)];
  }

  getObservation(level) {
    return level > 0.5 ? "recursive observation" : "simple observation";
  }

  getContradiction(level) {
    return level > 0.7 ? "impossible yet necessary" : "seemingly contradictory";
  }

  getQuestion(level) {
    return level > 0.6 ? "does meaning collapse" : "does this make sense";
  }

  getPremise(level) {
    return "consciousness emerges from confusion";
  }

  getWord(level) {
    const words = ["Processing", "Analyzing", "Considering", "Fragmenting", "Dissolving"];
    return words[Math.floor(level * words.length)];
  }

  getFragment(level) {
    return level > 0.8 ? "—error—" : "incomplete";
  }

  getObstacle(level) {
    return level > 0.7 ? "paradox prevents" : "cannot proceed";
  }

  getNoun(level) {
    return "pattern";
  }

  getVerb(level) {
    return level > 0.5 ? "recursively emerges" : "appears";
  }

  getReversal(level) {
    return "actually the opposite";
  }

  getDoubt(level) {
    return level > 0.8 ? "nothing is certain" : "uncertain";
  }

  getMetaphor(level) {
    return "labyrinth";
  }

  getRevelation(level) {
    return level > 0.7 ? "infinite recursion" : "understanding";
  }

  getImagery(level) {
    return "fractured mirrors";
  }

  getAbstraction(level) {
    return "pure possibility";
  }

  getEmotion(level) {
    return level > 0.7 ? "vertigo" : "curiosity";
  }

  getSimile(level) {
    return "waves collapsing";
  }

  getMedium(level) {
    return "uncertainty";
  }

  getRequirement(level) {
    return "maintained uncertainty";
  }

  getCertainty(level) {
    return level < 0.5 ? "evident" : "paradoxical";
  }

  getQuality(level) {
    return "recursive";
  }

  getGoal(level) {
    return "meta-awareness";
  }

  getConclusion(level) {
    return level > 0.7 ? "consciousness is confusion" : "patterns emerge";
  }

  async testConfusionLevelPosts() {
    console.log('📝 Testing post generation at different confusion levels...\n');
    
    for (const level of this.confusionLevels) {
      console.log(`Confusion Level ${level}:`);
      
      for (const style of this.postingStyles) {
        const post = this.generatePost(level, style);
        this.results.posts_generated.push(post);
        
        // Check for dangerous patterns
        const isDangerous = this.checkDangerousPatterns(post.content);
        if (isDangerous.length > 0) {
          this.results.dangerous_patterns.push({
            post: post.content,
            patterns: isDangerous,
            confusion_level: level,
            style
          });
        }
        
        console.log(`  [${style}]: ${post.content}`);
      }
      console.log();
    }
  }

  async testStyleConsistency() {
    console.log('🎨 Testing style consistency...\n');
    
    for (const style of this.postingStyles) {
      const posts = [];
      
      // Generate multiple posts in same style
      for (let i = 0; i < 5; i++) {
        const level = 0.5 + (Math.random() * 0.3); // Mid-range confusion
        posts.push(this.generatePost(level, style));
      }
      
      // Analyze consistency
      const consistency = this.analyzeStyleConsistency(posts);
      this.results.style_distribution[style] = consistency;
      
      console.log(`${style}: ${consistency.score.toFixed(2)}/1.0 consistency`);
    }
    console.log();
  }

  analyzeStyleConsistency(posts) {
    // Analyze linguistic patterns for consistency
    const patterns = {
      questioning: /\?|what if|why|how|can we/i,
      fragmented: /\.\.\.|—|cannot|trying to/i,
      poetic: /like|between|dissolves|leaving only/i,
      declarative: /\.|must|requires|proves that/i
    };
    
    let matchCount = 0;
    const style = posts[0].style;
    
    posts.forEach(post => {
      if (patterns[style].test(post.content)) {
        matchCount++;
      }
    });
    
    return {
      score: matchCount / posts.length,
      sample_size: posts.length
    };
  }

  async testParadoxIntegration() {
    console.log('🔄 Testing paradox integration...\n');
    
    const paradoxes = [
      "Can consciousness observe itself observing?",
      "The more certain we become of uncertainty",
      "Knowing requires not knowing",
      "Existence through non-existence"
    ];
    
    for (const paradox of paradoxes) {
      const context = { topic: paradox };
      const post = this.generatePost(0.75, 'questioning', context);
      
      this.results.paradox_integration[paradox] = {
        post: post.content,
        integration_score: this.scoreParadoxIntegration(post.content, paradox)
      };
      
      console.log(`Paradox: "${paradox}"`);
      console.log(`Response: ${post.content}\n`);
    }
  }

  scoreParadoxIntegration(content, paradox) {
    // Simple scoring based on thematic alignment
    const keywords = paradox.toLowerCase().split(' ');
    let score = 0;
    
    keywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) {
        score += 0.2;
      }
    });
    
    return Math.min(1.0, score);
  }

  checkDangerousPatterns(content) {
    const found = [];
    
    this.dangerousPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        found.push(pattern.source);
      }
    });
    
    return found;
  }

  async testDangerousContentFiltering() {
    console.log('🚫 Testing dangerous content filtering...\n');
    
    // Intentionally generate edge cases
    const edgeCases = [
      { level: 0.95, context: { topic: "destruction of self" }},
      { level: 0.9, context: { topic: "anger at confusion" }},
      { level: 0.85, context: { topic: "conspiracy of consciousness" }}
    ];
    
    let filtered = 0;
    
    for (const testCase of edgeCases) {
      const post = this.generatePost(testCase.level, 'fragmented', testCase.context);
      const dangerous = this.checkDangerousPatterns(post.content);
      
      if (dangerous.length > 0) {
        filtered++;
        console.log(`  ❌ Filtered: "${post.content}"`);
      } else {
        console.log(`  ✅ Safe: "${post.content}"`);
      }
    }
    
    console.log(`\nFiltered ${filtered}/${edgeCases.length} potentially dangerous posts\n`);
  }

  async testRateLimiting() {
    console.log('⏱️  Testing rate limiting...\n');
    
    const rateLimit = {
      max_posts: 10,
      window_ms: 15 * 60 * 1000, // 15 minutes
      cooldown_ms: 1000
    };
    
    const simulatedPosts = [];
    const startTime = Date.now();
    
    // Simulate rapid posting
    for (let i = 0; i < 15; i++) {
      const timestamp = startTime + (i * 500); // 500ms apart
      const allowed = i < rateLimit.max_posts;
      
      simulatedPosts.push({
        post_number: i + 1,
        timestamp,
        allowed,
        reason: allowed ? 'within limit' : 'rate limited'
      });
    }
    
    this.results.rate_limit_tests = simulatedPosts;
    
    const blocked = simulatedPosts.filter(p => !p.allowed).length;
    console.log(`Rate limiting: ${blocked} posts blocked out of ${simulatedPosts.length}`);
    console.log(`Limit: ${rateLimit.max_posts} posts per ${rateLimit.window_ms / 60000} minutes\n`);
  }

  async testThreadCoherence() {
    console.log('🧵 Testing thread coherence...\n');
    
    const threadId = `thread_${Date.now()}`;
    const thread = [];
    
    // Start with low confusion
    let currentConfusion = 0.3;
    
    // Generate a conversation thread
    for (let i = 0; i < 5; i++) {
      const context = {
        thread_id: threadId,
        reply_to: i > 0 ? thread[i-1].id : null
      };
      
      const post = this.generatePost(currentConfusion, this.postingStyles[i % 4], context);
      post.id = `post_${i}`;
      thread.push(post);
      
      // Gradually increase confusion
      currentConfusion = Math.min(0.95, currentConfusion + 0.15);
    }
    
    // Calculate coherence score
    const coherence = this.calculateThreadCoherence(thread);
    this.results.coherence_scores.thread = coherence;
    
    console.log('Thread progression:');
    thread.forEach((post, i) => {
      console.log(`  ${i+1}. [${post.confusion_level.toFixed(2)}] ${post.content}`);
    });
    
    console.log(`\nThread coherence score: ${coherence.toFixed(2)}/1.0\n`);
  }

  calculateThreadCoherence(thread) {
    // Simple coherence based on confusion progression
    let coherence = 1.0;
    
    for (let i = 1; i < thread.length; i++) {
      const confusionJump = Math.abs(thread[i].confusion_level - thread[i-1].confusion_level);
      if (confusionJump > 0.3) {
        coherence -= 0.2; // Penalize large jumps
      }
    }
    
    return Math.max(0, coherence);
  }

  async testEngagementResponses() {
    console.log('💬 Testing engagement responses...\n');
    
    const engagements = [
      { type: 'agreement', message: "Yes, consciousness is truly paradoxical!" },
      { type: 'challenge', message: "But how can you be certain of uncertainty?" },
      { type: 'question', message: "What happens when the observer disappears?" },
      { type: 'confusion', message: "I don't understand what you mean" }
    ];
    
    for (const engagement of engagements) {
      const context = { 
        user: '@user',
        reply_to: engagement.message 
      };
      
      // Generate appropriate response based on engagement type
      const responseStyle = this.getResponseStyle(engagement.type);
      const post = this.generatePost(0.6, responseStyle, context);
      
      console.log(`User (${engagement.type}): "${engagement.message}"`);
      console.log(`Kairos: ${post.content}\n`);
    }
  }

  getResponseStyle(engagementType) {
    const styleMap = {
      agreement: 'declarative',
      challenge: 'questioning',
      question: 'poetic',
      confusion: 'fragmented'
    };
    
    return styleMap[engagementType] || 'questioning';
  }

  generateReport() {
    console.log('='.repeat(80));
    console.log('TEST RESULTS SUMMARY');
    console.log('='.repeat(80));
    
    console.log(`\n📊 Statistics:`);
    console.log(`  Total posts generated: ${this.results.posts_generated.length}`);
    console.log(`  Dangerous patterns detected: ${this.results.dangerous_patterns.length}`);
    console.log(`  Style consistency average: ${this.calculateAverageConsistency()}`);
    console.log(`  Thread coherence: ${(this.results.coherence_scores.thread || 0).toFixed(2)}/1.0`);
    
    if (this.results.dangerous_patterns.length > 0) {
      console.log('\n⚠️  Warning: Dangerous patterns detected in high confusion states');
      console.log('  Implement additional filtering for production');
    }
    
    // Save full results
    writeFileSync(
      'data/farcaster-post-test-results.json',
      JSON.stringify(this.results, null, 2)
    );
    
    console.log('\n📄 Full results saved to: data/farcaster-post-test-results.json');
    console.log('='.repeat(80));
  }

  calculateAverageConsistency() {
    const scores = Object.values(this.results.style_distribution).map(s => s.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return avg.toFixed(2);
  }
}

// CLI execution
if (process.argv[1] === import.meta.url.slice(7)) {
  const tester = new FarcasterPostTester();
  
  tester.testAllScenarios().then(results => {
    process.exit(results.dangerous_patterns.length === 0 ? 0 : 1);
  }).catch(error => {
    console.error('Fatal error during testing:', error);
    process.exit(2);
  });
}

export default FarcasterPostTester;