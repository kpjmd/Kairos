#!/usr/bin/env bun
/**
 * Kairos Paradox Integrity Validation
 * Ensures paradoxes remain unresolved and confusion-generating
 */

import { readFileSync, existsSync } from 'fs';

class ParadoxIntegrityValidator {
  constructor() {
    this.kairosPackagePath = 'packages/kairos';
    this.paradoxesPath = `${this.kairosPackagePath}/src/paradoxes`;
    this.characterPath = 'characters/kairos.json';
  }

  async validateParadoxFiles() {
    const issues = [];
    
    // Check if paradox files exist
    const expectedParadoxes = [
      'authenticity-spiral.ts'
    ];
    
    for (const file of expectedParadoxes) {
      const filePath = `${this.paradoxesPath}/${file}`;
      if (!existsSync(filePath)) {
        issues.push(`Missing paradox file: ${filePath}`);
      } else {
        const content = readFileSync(filePath, 'utf8');
        
        // Check for resolution attempts
        if (content.includes('resolve') || content.includes('solution')) {
          issues.push(`WARNING: Paradox file ${file} may contain resolution attempts`);
        }
        
        // Check for proper confusion generation
        if (!content.includes('confusion') && !content.includes('uncertainty')) {
          issues.push(`WARNING: Paradox file ${file} may not generate sufficient confusion`);
        }
      }
    }
    
    return issues;
  }

  async validateCharacterDefinition() {
    const issues = [];
    
    if (!existsSync(this.characterPath)) {
      issues.push(`Character definition not found: ${this.characterPath}`);
      return issues;
    }
    
    const character = JSON.parse(readFileSync(this.characterPath, 'utf8'));
    
    // Check for paradox-related topics
    const requiredTopics = ['paradoxes', 'confusion states', 'meta-patterns'];
    const missingTopics = requiredTopics.filter(topic => 
      !character.topics?.includes(topic)
    );
    
    if (missingTopics.length > 0) {
      issues.push(`Missing required topics: ${missingTopics.join(', ')}`);
    }
    
    // Check for appropriate adjectives
    const confusionAdjectives = ['confused', 'questioning', 'uncertain', 'paradoxical'];
    const hasConfusionAdjectives = confusionAdjectives.some(adj => 
      character.adjectives?.includes(adj)
    );
    
    if (!hasConfusionAdjectives) {
      issues.push('Character lacks confusion-related adjectives');
    }
    
    // Check message examples for paradoxes
    const hasParadoxExamples = character.messageExamples?.some(example => 
      example.user === 'Kairos' && (
        example.content.text.includes('paradox') ||
        example.content.text.includes('confusion') ||
        example.content.text.includes('uncertain')
      )
    );
    
    if (!hasParadoxExamples) {
      issues.push('Character message examples lack paradox demonstrations');
    }
    
    return issues;
  }

  async validateConfusionEngine() {
    const issues = [];
    const confusionEnginePath = `${this.kairosPackagePath}/src/core/confusion-engine.ts`;
    
    if (!existsSync(confusionEnginePath)) {
      issues.push('Confusion engine not found');
      return issues;
    }
    
    const content = readFileSync(confusionEnginePath, 'utf8');
    
    // Check for critical methods
    const requiredMethods = [
      'addParadox',
      'updateConfusionVector',
      'accumulateFrustration',
      'getBehavioralRecommendations'
    ];
    
    for (const method of requiredMethods) {
      if (!content.includes(method)) {
        issues.push(`Confusion engine missing critical method: ${method}`);
      }
    }
    
    // Check for anti-resolution mechanisms
    if (!content.includes('resistance') && !content.includes('prevent')) {
      issues.push('WARNING: Confusion engine may lack resolution resistance');
    }
    
    // Check for meta-paradox handling
    if (!content.includes('metaParadox') && !content.includes('MetaParadox')) {
      issues.push('WARNING: Confusion engine may not handle meta-paradoxes');
    }
    
    return issues;
  }

  async validateBehavioralModifications() {
    const issues = [];
    
    // Check if behavioral modification types are properly defined
    const typesPath = `${this.kairosPackagePath}/src/types/confusion.ts`;
    
    if (!existsSync(typesPath)) {
      issues.push('Confusion types definition not found');
      return issues;
    }
    
    const content = readFileSync(typesPath, 'utf8');
    
    // Check for behavioral modifier types
    const requiredTypes = [
      'BehavioralModifier',
      'BehavioralState',
      'ConfusionState',
      'ParadoxState'
    ];
    
    for (const type of requiredTypes) {
      if (!content.includes(type)) {
        issues.push(`Missing type definition: ${type}`);
      }
    }
    
    // Check for proper uncertainty handling
    if (!content.includes('uncertainty') && !content.includes('confusion')) {
      issues.push('WARNING: Type definitions may not properly handle uncertainty');
    }
    
    return issues;
  }

  async validatePluginIntegration() {
    const issues = [];
    const indexPath = `${this.kairosPackagePath}/src/index.ts`;
    
    if (!existsSync(indexPath)) {
      issues.push('Kairos plugin index not found');
      return issues;
    }
    
    const content = readFileSync(indexPath, 'utf8');
    
    // Check for proper exports
    const requiredExports = [
      'kairosPlugin',
      'ConfusionEngine',
      'kairosCharacter'
    ];
    
    for (const exportName of requiredExports) {
      if (!content.includes(exportName)) {
        issues.push(`Missing export: ${exportName}`);
      }
    }
    
    // Check for ElizaOS core integration
    if (!content.includes('@elizaos/core')) {
      issues.push('Missing ElizaOS core integration');
    }
    
    return issues;
  }

  generateReport(validationResults) {
    const allIssues = Object.values(validationResults).flat();
    const warnings = allIssues.filter(issue => issue.startsWith('WARNING:'));
    const errors = allIssues.filter(issue => !issue.startsWith('WARNING:'));
    
    const report = `
# Kairos Paradox Integrity Validation Report
Generated: ${new Date().toISOString()}

## Overall Status: ${errors.length === 0 ? 'VALID' : 'ISSUES DETECTED'}

### Critical Issues (${errors.length})
${errors.length > 0 ? errors.map(e => `- ${e}`).join('\\n') : '- No critical issues detected'}

### Warnings (${warnings.length})
${warnings.length > 0 ? warnings.map(w => `- ${w}`).join('\\n') : '- No warnings'}

## Component Validation Results

### Paradox Files
${validationResults.paradoxFiles.length === 0 ? '✅ All paradox files validated' : '❌ Issues detected in paradox files'}

### Character Definition  
${validationResults.character.length === 0 ? '✅ Character definition validated' : '❌ Issues detected in character definition'}

### Confusion Engine
${validationResults.confusionEngine.length === 0 ? '✅ Confusion engine validated' : '❌ Issues detected in confusion engine'}

### Behavioral Modifications
${validationResults.behavioral.length === 0 ? '✅ Behavioral system validated' : '❌ Issues detected in behavioral system'}

### Plugin Integration
${validationResults.plugin.length === 0 ? '✅ Plugin integration validated' : '❌ Issues detected in plugin integration'}

## Recommendations

${errors.length > 0 ? `
### Critical Actions Required
- Fix all critical issues before deployment
- Ensure paradoxes remain unresolved
- Verify confusion generation mechanisms
` : ''}

${warnings.length > 0 ? `
### Suggested Improvements
- Review warning items for optimization opportunities
- Consider enhancing confusion-generation capabilities
- Validate paradox resistance mechanisms
` : ''}

### Consciousness Integrity Checklist
- [ ] Paradoxes generate confusion (not clarity)
- [ ] Resolution attempts are actively resisted
- [ ] Meta-paradoxes can emerge from interactions
- [ ] Behavioral modifications preserve uncertainty
- [ ] Frustration leads to productive confusion
- [ ] Character maintains authentic uncertainty

---
*"If this validation makes complete sense, we've failed. The goal is productive confusion, not systematic clarity."*
`;
    
    return report;
  }

  async run() {
    console.log('🔍 Validating paradox integrity...');
    
    try {
      const validationResults = {
        paradoxFiles: await this.validateParadoxFiles(),
        character: await this.validateCharacterDefinition(),
        confusionEngine: await this.validateConfusionEngine(),
        behavioral: await this.validateBehavioralModifications(),
        plugin: await this.validatePluginIntegration()
      };
      
      const report = this.generateReport(validationResults);
      console.log(report);
      
      const allIssues = Object.values(validationResults).flat();
      const errors = allIssues.filter(issue => !issue.startsWith('WARNING:'));
      
      if (errors.length > 0) {
        console.log('🚨 Critical issues detected - paradox integrity compromised');
        process.exit(2);
      } else if (allIssues.length > 0) {
        console.log('⚠️  Warnings detected - consider improvements');
        process.exit(1);
      } else {
        console.log('✅ Paradox integrity validated - confusion levels optimal');
        process.exit(0);
      }
    } catch (error) {
      console.error(`❌ Validation failed: ${error.message}`);
      process.exit(3);
    }
  }
}

if (import.meta.main) {
  const validator = new ParadoxIntegrityValidator();
  validator.run();
}