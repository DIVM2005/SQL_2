#!/bin/bash

# Initialize git repository if not already initialized
if [ ! -d .git ]; then
    git init
fi

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: SQL Query Generator with AI agent"

# Add GitHub remote with specific repository name
git remote add origin https://github.com/DIVM2005/SQL_1.git

# Push to GitHub
git push -u origin main

echo "Your project has been uploaded to GitHub!" 