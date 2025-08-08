#!/bin/bash

# Script to remove all console statements from TypeScript/JavaScript files

echo "Removing console statements from all files..."

# List of files to fix
files=(
    "src/components/auctions/EditAuctionModal.tsx"
    "src/services/ads.ts"
    "src/services/api.ts"
    "src/services/bid.ts"
)

# Remove console statements from each file
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        # Remove lines that contain console. statements
        sed -i '/console\./d' "$file"
        echo "Processed $file"
    else
        echo "File $file not found"
    fi
done

echo "Console statement removal complete!"
