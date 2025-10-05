#!/bin/bash

# Railway Build Wrapper Script
# Purpose: Prevent Railway from passing deprecated --verbose flag to Turbo
# Railway's Nixpacks automatically appends --verbose, but Turbo 2.5+ requires --verbosity
# This wrapper ignores all arguments and runs the exact build command we need

set -e

echo "🚂 Railway Build Wrapper - Starting build process..."
echo "   Ignoring Railway's auto-added flags to prevent Turbo deprecation errors"
echo ""

# Run turbo build with exact flags we need, ignoring any args passed by Railway
npx turbo run build --filter=!./packages/app --filter=!@elizaos/config --concurrency=2

echo ""
echo "✅ Build complete!"
