#!/bin/bash

# Initialize git repository if not already initialized
if [ ! -d .git ]; then
    git init
fi

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: SQL Query Generator with AI agent"

# Add GitHub remote (replace with your repository URL)
echo "Please enter your GitHub repository URL:"
read repo_url
git remote add origin $repo_url

# Push to GitHub
git push -u origin main

echo "Your project has been uploaded to GitHub!" 