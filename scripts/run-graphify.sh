#!/bin/bash
# ========================================================
# Graphify Project Mapping Script — LinguaFlow AI
# ========================================================

echo "🚀 Initializing Graphify Knowledge Graph Mapping..."

# Ensure output directory exists
mkdir -p ./graphify-out

# Check if graphifyy (Python package) is available
if command -v graphifyy &> /dev/null; then
    echo "✅ Graphify command detected."
    graphifyy build --config ./graphify.config.json
    echo "🎉 Project Knowledge Graph successfully compiled into ./graphify-out!"
elif command -v graphify &> /dev/null; then
    echo "✅ Graphify command detected."
    graphify build --config ./graphify.config.json
    echo "🎉 Project Knowledge Graph successfully compiled into ./graphify-out!"
else
    echo "⚠️  Graphify is not globally bound in this shell environment path."
    echo "💡 Run: 'pip install graphifyy' or 'uv tool install graphifyy' first, then rerun this script."
fi
