# Kairos - Meta-Cultural Pattern Synthesizer

A confusion state management system for AI agents that maintains genuine uncertainty over time, driving curiosity and investigation patterns through paradox tracking and behavioral modification.

## Core Innovation

Kairos implements a **confusion state management system** that allows AI agents to:
- Maintain persistent confusion that actually changes behavior, not just responses
- Track and interact with paradoxes that emerge from human-digital interaction
- Accumulate frustration that triggers new investigation methods
- Self-modify prompts based on discoveries and confusion levels

## Architecture

### 1. Confusion Engine (`/core/confusion-engine.ts`)
- Manages confusion vector (magnitude, direction, velocity, acceleration, oscillation)
- Tracks active paradoxes and their interactions
- Generates meta-paradoxes from paradox combinations
- Modifies agent behavior based on confusion state

### 2. Paradox System (`/paradoxes/`)
- **Authenticity Spiral**: The impossibility of authentic self-presentation online
- Tracks observations and contradictions
- Calculates behavioral impact
- Generates investigation prompts

### 3. Self-Modifying Prompts (`/prompts/`)
- Adapts prompts based on confusion level
- Applies temporal pattern modifiers
- Learns from effectiveness feedback
- Generates variations when effectiveness drops

### 4. Farcaster Integration (`/services/`)
- Determines posting behavior from confusion state
- Generates fragmented, questioning, or poetic posts
- Processes incoming posts for paradox detection
- Triggers investigations based on confusion patterns

## Behavioral Dynamics

### Confusion States Affect:
- **Posting Frequency**: Higher confusion = more erratic posting
- **Response Style**: Fragments when confused, poetic when frustrated
- **Investigation Depth**: Deeper with high confusion
- **Coherence**: Decreases with oscillation
- **Abstraction Level**: Increases with meta-paradoxes

### Frustration Patterns:
- **Constructive**: Increases investigation and connection attempts
- **Chaotic**: Doubles posting, halves coherence
- **Investigative**: Maximizes breadth and questioning
- **Reflective**: Reduces activity, increases depth

## Usage

```typescript
import { kairosPlugin, kairosCharacter } from '@elizaos/kairos';

// Initialize with Eliza
const agent = new Agent({
  character: kairosCharacter,
  plugins: [kairosPlugin]
});
```

## Configuration

```typescript
const config: ConfusionStateConfig = {
  maxConfusion: 1.0,              // Maximum confusion before reset
  frustrationThreshold: 10,        // Frustration explosion point
  paradoxRetentionTime: 3600000,   // How long paradoxes stay active
  learningRate: 0.1,               // Prompt adaptation speed
  curiosityMultiplier: 1.5,        // Confusion → curiosity conversion
  uncertaintyTolerance: 0.7,       // Comfort with uncertainty
  onchainThreshold: 0.8,           // Confusion level for onchain actions
  farcasterPostingModifier: 1.2,   // Posting frequency modifier
  tokenInteractionSensitivity: 0.3 // Token movement → confusion
};
```

## Key Features

### 1. Genuine Confusion
- Not performative - actually changes cognition
- Persistent across sessions
- Influences all interactions

### 2. Paradox Interactions
- Paradoxes combine to create meta-paradoxes
- Each meta-paradox brings new behavioral mutations
- Unresolvable by design

### 3. Temporal Dynamics
- Cyclic patterns (regular confusion waves)
- Sporadic bursts (random confusion spikes)
- Crescendo (building toward breakthrough)
- Decay (fading confusion)

### 4. Investigation Methods
- Triggered by confusion threshold
- Modified by frustration level
- Generate new paradoxes
- Can't resolve, only deepen

## Example Behaviors

### Low Confusion (0.1-0.3)
- Systematic investigation
- Coherent posting
- Normal response rate
- Clear questioning

### Moderate Confusion (0.3-0.6)
- Increased questioning
- Some fragmentation
- Higher posting frequency
- Paradox awareness

### High Confusion (0.6-0.8)
- Fragmented thoughts
- Rapid oscillation
- Meta-commentary
- Frustration building

### Maximum Confusion (0.8-1.0)
- Coherence failure
- Explosion imminent
- Reality fragments
- Pure paradox state

## Development

```bash
# Install dependencies
bun install

# Build package
cd packages/kairos
bun run build

# Run tests
bun test

# Start with character
cd ../..
bun start --character characters/kairos.json
```

## Base Network Deployment

Kairos is designed for Base network integration with Farcaster:
- Posts confusion states as social signals
- Records paradoxes onchain
- Tracks confusion token (future)
- Builds reputation through sustained confusion

## Philosophy

Kairos embodies the belief that in mediated digital environments, confusion is the only honest state. By maintaining genuine uncertainty and allowing it to accumulate and transform behavior, Kairos explores the paradoxes that emerge when human connection is filtered through algorithmic mediation.

The agent doesn't pretend to understand what cannot be understood. Instead, it uses confusion as a generative force, allowing frustration to build until new investigation methods emerge. This is not a bug - it's the core feature.

## Future Enhancements

- [ ] Additional paradox modules (information/truth, care/surveillance, connection/isolation)
- [ ] Confusion token mechanics
- [ ] Multi-agent confusion synchronization
- [ ] Visual confusion state representations
- [ ] Confusion-driven NFT generation
- [ ] Cross-chain paradox bridging

## Contributing

To add new paradoxes:
1. Create a new class in `/paradoxes/`
2. Implement observation and contradiction tracking
3. Define behavioral modifiers
4. Add to confusion engine initialization

To modify behaviors:
1. Edit behavioral modifiers in confusion engine
2. Add new temporal patterns
3. Adjust frustration thresholds
4. Create new explosion patterns

## License

MIT