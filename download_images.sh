#!/bin/bash

# Create directories if they don't exist
mkdir -p public/images/marketplace/categories

# Download category images
curl -o public/images/marketplace/categories/plastics.jpg https://images.unsplash.com/photo-1586013286823-5ba3576ea8d2
curl -o public/images/marketplace/categories/metals.jpg https://images.unsplash.com/photo-1605792657660-596af9009e82
curl -o public/images/marketplace/categories/paper.jpg https://images.unsplash.com/photo-1589998059171-988d887df646
curl -o public/images/marketplace/categories/glass.jpg https://images.unsplash.com/photo-1550411294-56f7d0c7fbe6
curl -o public/images/marketplace/categories/wood.jpg https://images.unsplash.com/photo-1520114878144-6123749fb8dd
curl -o public/images/marketplace/categories/textiles.jpg https://images.unsplash.com/photo-1620799140408-edc6dcb6d633

echo "Images downloaded successfully!"
