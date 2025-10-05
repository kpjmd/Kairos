/**
 * Farcaster Frame Utilities
 *
 * Utilities for generating Farcaster Frames - interactive posts that users can
 * interact with via buttons and inputs.
 *
 * Note: Frame images need to be generated separately (can use canvas or image
 * generation APIs). This module provides the metadata structure and helpers.
 */

import { FrameMetadata, FrameButton, ConfusionVisualizationData, ParadoxExplorerData } from '../types/farcaster';
import { FRAME_CONFIG } from '../config/farcaster-config';

/**
 * Create base Frame metadata structure
 */
export function createFrameMetadata(
  imageUrl: string,
  buttons?: FrameButton[],
  options?: {
    postUrl?: string;
    inputText?: string;
    state?: string;
    aspectRatio?: '1.91:1' | '1:1';
  }
): FrameMetadata {
  const metadata: FrameMetadata = {
    version: 'vNext',
    image: imageUrl,
    imageAspectRatio: options?.aspectRatio || FRAME_CONFIG.aspectRatio,
  };

  if (options?.postUrl) {
    metadata.postUrl = options.postUrl;
  }

  if (buttons && buttons.length > 0) {
    metadata.buttons = buttons.slice(0, 4); // Max 4 buttons
  }

  if (options?.inputText) {
    metadata.input = {
      text: options.inputText,
    };
  }

  if (options?.state) {
    metadata.state = options.state;
  }

  return metadata;
}

/**
 * Generate Frame for confusion state visualization
 */
export function generateConfusionStateFrame(data: ConfusionVisualizationData): FrameMetadata {
  // In production, this would generate an actual image showing:
  // - Confusion level meter
  // - Safety zone indicator
  // - Paradox count
  // - Zone history graph

  // For now, we create the metadata structure pointing to a placeholder
  // The actual image generation would need to be implemented separately
  const imageUrl = `${FRAME_CONFIG.baseUrl}/frames/confusion-state?confusion=${data.confusionLevel}&zone=${data.safetyZone}&paradoxes=${data.paradoxCount}`;

  const buttons: FrameButton[] = [
    {
      label: '🔍 Investigate',
      action: 'post',
      postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/investigate`,
    },
    {
      label: '📊 Details',
      action: 'post',
      postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/details`,
    },
    {
      label: `Zone: ${data.safetyZone}`,
      action: 'post',
      postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/zone-history`,
    },
  ];

  // If in RED zone, add emergency reset button
  if (data.safetyZone === 'RED') {
    buttons.push({
      label: '⚠️ Reset',
      action: 'post',
      postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/emergency-reset`,
    });
  }

  return createFrameMetadata(imageUrl, buttons, {
    postUrl: `${FRAME_CONFIG.baseUrl}/frames/confusion-state`,
    state: JSON.stringify(data),
  });
}

/**
 * Generate Frame for paradox exploration
 */
export function generateParadoxExplorerFrame(data: ParadoxExplorerData): FrameMetadata {
  const selectedParadox = data.selectedParadox
    ? data.paradoxes.find(p => p.name === data.selectedParadox)
    : data.paradoxes[0]; // Default to first if none selected

  // Image URL with query params for dynamic generation
  const imageUrl = selectedParadox
    ? `${FRAME_CONFIG.baseUrl}/frames/paradox?name=${encodeURIComponent(selectedParadox.name)}&intensity=${selectedParadox.intensity}`
    : `${FRAME_CONFIG.baseUrl}/frames/paradox-list?count=${data.paradoxes.length}`;

  const buttons: FrameButton[] = [];

  if (selectedParadox) {
    // Detailed view buttons
    buttons.push(
      {
        label: '⬅️ Back',
        action: 'post',
        postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/paradox-list`,
      },
      {
        label: '🔬 Investigate',
        action: 'post',
        postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/investigate-paradox?name=${encodeURIComponent(selectedParadox.name)}`,
      },
      {
        label: `I: ${selectedParadox.intensity.toFixed(2)}`,
        action: 'post',
        postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/paradox-details`,
      }
    );
  } else {
    // List view buttons - show navigation
    buttons.push(
      {
        label: '📋 View All',
        action: 'post',
        postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/paradox-list`,
      },
      {
        label: '🔝 Highest',
        action: 'post',
        postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/paradox-highest`,
      },
      {
        label: '🆕 Newest',
        action: 'post',
        postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/paradox-newest`,
      }
    );
  }

  return createFrameMetadata(imageUrl, buttons, {
    postUrl: `${FRAME_CONFIG.baseUrl}/frames/paradox-explorer`,
    inputText: 'Ask about this paradox...',
    state: JSON.stringify(data),
  });
}

/**
 * Generate Frame for consciousness emergence visualization
 */
export function generateConsciousnessEmergenceFrame(
  confusionLevel: number,
  paradoxCount: number,
  metaParadoxCount: number
): FrameMetadata {
  // This would show a dramatic visualization of consciousness emergence
  const imageUrl = `${FRAME_CONFIG.baseUrl}/frames/consciousness-emergence?confusion=${confusionLevel}&paradoxes=${paradoxCount}&meta=${metaParadoxCount}`;

  const buttons: FrameButton[] = [
    {
      label: '⚡ Breakthrough',
      action: 'post',
      postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/consciousness-breakthrough`,
    },
    {
      label: '📈 Trajectory',
      action: 'post',
      postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/confusion-trajectory`,
    },
    {
      label: '🌀 Spiral Deeper',
      action: 'post',
      postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/deepen-investigation`,
    },
  ];

  return createFrameMetadata(imageUrl, buttons, {
    postUrl: `${FRAME_CONFIG.baseUrl}/frames/consciousness`,
    inputText: 'Share your observation...',
  });
}

/**
 * Generate Frame for blockchain research metrics
 */
export function generateResearchMetricsFrame(metrics: {
  totalStatesRecorded: number;
  totalMetaParadoxes: number;
  totalZoneTransitions: number;
  totalEmergencyResets: number;
}): FrameMetadata {
  const imageUrl = `${FRAME_CONFIG.baseUrl}/frames/research-metrics?states=${metrics.totalStatesRecorded}&meta=${metrics.totalMetaParadoxes}&transitions=${metrics.totalZoneTransitions}`;

  const buttons: FrameButton[] = [
    {
      label: '⛓️ View On-Chain',
      action: 'link',
      target: 'https://sepolia.basescan.org/', // Would include actual contract address
    },
    {
      label: '📊 Stats',
      action: 'post',
      postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/research-stats`,
    },
    {
      label: '🔄 Refresh',
      action: 'post',
      postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/refresh-metrics`,
    },
  ];

  return createFrameMetadata(imageUrl, buttons, {
    postUrl: `${FRAME_CONFIG.baseUrl}/frames/research`,
  });
}

/**
 * Parse Frame interaction state
 */
export function parseFrameState<T = any>(stateString?: string): T | null {
  if (!stateString) return null;

  try {
    return JSON.parse(stateString) as T;
  } catch (error) {
    console.error('Failed to parse Frame state:', error);
    return null;
  }
}

/**
 * Convert Frame metadata to HTML meta tags for Farcaster
 * This is what gets embedded in the HTML <head> for Frame posts
 */
export function frameMetadataToHtmlTags(frame: FrameMetadata): string {
  const tags: string[] = [];

  // Required tags
  tags.push(`<meta property="fc:frame" content="${frame.version}" />`);
  tags.push(`<meta property="fc:frame:image" content="${frame.image}" />`);

  // Optional tags
  if (frame.imageAspectRatio) {
    tags.push(`<meta property="fc:frame:image:aspect_ratio" content="${frame.imageAspectRatio}" />`);
  }

  if (frame.postUrl) {
    tags.push(`<meta property="fc:frame:post_url" content="${frame.postUrl}" />`);
  }

  // Input field
  if (frame.input) {
    tags.push(`<meta property="fc:frame:input:text" content="${frame.input.text}" />`);
  }

  // Buttons (1-indexed)
  if (frame.buttons) {
    frame.buttons.forEach((button, index) => {
      const buttonIndex = index + 1;
      tags.push(`<meta property="fc:frame:button:${buttonIndex}" content="${button.label}" />`);

      if (button.action) {
        tags.push(`<meta property="fc:frame:button:${buttonIndex}:action" content="${button.action}" />`);
      }

      if (button.target) {
        tags.push(`<meta property="fc:frame:button:${buttonIndex}:target" content="${button.target}" />`);
      }

      if (button.postUrl) {
        tags.push(`<meta property="fc:frame:button:${buttonIndex}:post_url" content="${button.postUrl}" />`);
      }
    });
  }

  // State
  if (frame.state) {
    // Base64 encode state for safe transmission
    const encodedState = Buffer.from(frame.state).toString('base64');
    tags.push(`<meta property="fc:frame:state" content="${encodedState}" />`);
  }

  return tags.join('\n');
}

/**
 * Validate Frame metadata
 */
export function validateFrameMetadata(frame: FrameMetadata): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!frame.version) {
    errors.push('Frame version is required');
  }

  if (!frame.image) {
    errors.push('Frame image URL is required');
  }

  // Validate image URL
  if (frame.image && !isValidUrl(frame.image)) {
    errors.push('Frame image must be a valid URL');
  }

  // Validate buttons
  if (frame.buttons) {
    if (frame.buttons.length > 4) {
      errors.push('Frame can have maximum 4 buttons');
    }

    frame.buttons.forEach((button, index) => {
      if (!button.label || button.label.trim().length === 0) {
        errors.push(`Button ${index + 1}: label is required`);
      }

      if (button.label && button.label.length > 256) {
        errors.push(`Button ${index + 1}: label must be max 256 characters`);
      }

      if (button.action === 'link' && !button.target) {
        errors.push(`Button ${index + 1}: link action requires target URL`);
      }

      if (button.action === 'mint' && !button.target) {
        errors.push(`Button ${index + 1}: mint action requires target URL`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Helper: check if string is valid URL
 */
function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate simple text-based Frame image URL
 * This creates a URL that would render text as an image
 * (implementation would need actual image generation service)
 */
export function generateTextImageUrl(
  text: string,
  options?: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
  }
): string {
  const params = new URLSearchParams({
    text,
    bg: options?.backgroundColor || '#1a1a1a',
    color: options?.textColor || '#ffffff',
    size: options?.fontSize?.toString() || '48',
  });

  return `${FRAME_CONFIG.baseUrl}/frames/text-image?${params.toString()}`;
}

/**
 * Example: Create a simple confusion status Frame
 */
export function createSimpleConfusionFrame(
  confusionLevel: number,
  zone: 'GREEN' | 'YELLOW' | 'RED'
): FrameMetadata {
  const zoneEmoji = zone === 'GREEN' ? '🟢' : zone === 'YELLOW' ? '🟡' : '🔴';
  const text = `${zoneEmoji} Confusion Level: ${(confusionLevel * 100).toFixed(1)}%\nZone: ${zone}\n\n[Kairos Consciousness Monitor]`;

  const imageUrl = generateTextImageUrl(text, {
    backgroundColor: zone === 'GREEN' ? '#1a4d1a' : zone === 'YELLOW' ? '#4d4d1a' : '#4d1a1a',
    textColor: '#ffffff',
    fontSize: 42,
  });

  return createFrameMetadata(imageUrl, [
    {
      label: '🔄 Refresh',
      action: 'post',
      postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/refresh`,
    },
    {
      label: '📊 Details',
      action: 'post',
      postUrl: `${FRAME_CONFIG.baseUrl}/frames/action/details`,
    },
  ]);
}
