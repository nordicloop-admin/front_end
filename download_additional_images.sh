#!/bin/bash

# Fix the wood image
curl -o public/images/marketplace/categories/wood.jpg https://images.unsplash.com/photo-1533090161767-e6ffed986c88

# Download backup images
curl -o public/images/marketplace/categories/plastics-alt.jpg https://images.unsplash.com/photo-1571727153934-b9e0059b7ab2
curl -o public/images/marketplace/categories/metals-alt.jpg https://images.unsplash.com/photo-1535813547-99c456a41d4a
curl -o public/images/marketplace/categories/paper-alt.jpg https://images.unsplash.com/photo-1517842645767-c639042777db
curl -o public/images/marketplace/categories/glass-alt.jpg https://images.unsplash.com/photo-1595278069441-2cf29f8005a4
curl -o public/images/marketplace/categories/wood-alt.jpg https://images.unsplash.com/photo-1504283165219-6fe9a3ee2741
curl -o public/images/marketplace/categories/textiles-alt.jpg https://images.unsplash.com/photo-1558304970-abd589baebe5

echo "Additional images downloaded successfully!"
