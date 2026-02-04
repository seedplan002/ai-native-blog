#!/bin/bash

# Reset Global Git Configuration.
git config --global --unset user.name
git config --global --unset user.email

# Prompt for Name, Email & Username & Repository (GitHub).

echo "=== Git User Configuration ==="
read -p "Name: " name
read -p "Email: " email

echo "=== GitHub Information ==="
read -p "Username: " username
read -p "Repository: " repository

# Configure Local Git Settings
git config user.name "$name"
git config user.email "$email"

# Set Remote URL
git remote set-url origin "https://${username}@github.com/${username}/${repository}.git"

# Switch GitHub Authentication
gh auth switch --user "$username"

echo "GitHub SetUp is done."