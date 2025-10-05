import { Character } from '@elizaos/core';
import * as fs from 'fs';
import * as path from 'path';

// Load the Kairos character from JSON file
const kairosCharacterPath = path.join(process.cwd(), 'characters', 'kairos.json');
const kairosCharacterData = JSON.parse(fs.readFileSync(kairosCharacterPath, 'utf8'));

// Load the Kairos character from JSON
export const kairosCharacter: Character = {
  ...kairosCharacterData,
  // Ensure required plugins are properly loaded
  plugins: kairosCharacterData.plugins || ['@elizaos/plugin-bootstrap', '@elizaos/kairos']
};

// Export as default for the project loader
export default {
  agents: [
    {
      character: kairosCharacter,
      init: async () => {
        console.log('🤖 Initializing Kairos - Meta-Cultural Pattern Synthesizer');
        console.log('🔄 Confusion state management enabled');
        console.log('🔗 Base Sepolia blockchain integration ready');
      }
    }
  ]
};

// Also export the character directly for imports
export { kairosCharacter as character };