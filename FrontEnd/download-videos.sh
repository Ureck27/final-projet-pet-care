#!/bin/bash

# Background Video Downloader for Pet Care Platform
# This script downloads high-quality, royalty-free background videos

echo "🎬 Downloading premium background videos..."

# Create videos directory
mkdir -p public/videos

# Download high-quality pet care related videos (these are sample URLs - replace with actual royalty-free videos)
# Note: These are placeholder URLs - you'll need to replace them with actual video sources

echo "📥 Downloading hero background video..."
# curl -L "https://example.com/hero-pet-video.mp4" -o public/videos/hero.mp4

echo "📥 Downloading about section background video..."
# curl -L "https://example.com/about-pet-care.mp4" -o public/videos/about.mp4

echo "📥 Downloading services background video..."
# curl -L "https://example.com/pet-services.mp4" -o public/videos/services.mp4

echo "📥 Downloading testimonials background video..."
# curl -L "https://example.com/testimonials.mp4" -o public/videos/testimonials.mp4

echo "✅ Video downloads completed!"
echo ""
echo "📝 Instructions:"
echo "1. Replace the placeholder URLs above with actual royalty-free video sources"
echo "2. Recommended sources:"
echo "   - Pexels Videos (free)"
echo "   - Pixabay Videos (free)"
echo "   - Coverr.co (free)"
echo "   - Artgrid (paid)"
echo "   - Storyblocks (paid)"
echo ""
echo "3. Video specifications:"
echo "   - Format: MP4 (H.264)"
echo "   - Resolution: 1920x1080 or higher"
echo "   - Duration: 10-30 seconds (looped)"
echo "   - Size: Under 10MB each"
echo "   - Content: Happy pets, professional caregivers, nature scenes"
echo ""
echo "4. Once downloaded, update the backgrounds array in:"
echo "   - components/layout/global-background.tsx"
echo "   - components/layout/premium-background.tsx"
