#!/bin/bash
# ========================================================
# Git Automation Push Script — HorizonTechX Translation Tool
# ========================================================

echo "🚀 Starting Git Repository Automation..."

# 1. Initialize git if not already present
if [ ! -d ".git" ]; then
    echo "📦 Initializing local Git repository..."
    git init
else
    echo "✅ Git repository already initialized."
fi

# 2. Add remote origin (handling potential existing origin)
echo "🔗 Setting remote origin to SAURAV-GGD..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/SAURAV-GGD/HorizonTechX_Language-Translation-Tool.git

# 3. Add files and commit
echo "📝 Staging files (respecting .gitignore)..."
git add .

echo "💾 Committing files..."
git commit -m "feat: complete production AI translation tool with concurrent real-time engines, tone mapping, and academic docs"

# 4. Set primary branch to main
git branch -M main

# 5. Push to GitHub
echo "📤 Pushing code to GitHub (this will use your local credentials)..."
echo "💡 If prompted, enter your GitHub Username and Personal Access Token (PAT) or use your SSH key."
echo "--------------------------------------------------------"

git push -u origin main

if [ $? -eq 0 ]; then
    echo "--------------------------------------------------------"
    echo "🎉 SUCCESS! Code successfully pushed to https://github.com/SAURAV-GGD/HorizonTechX_Language-Translation-Tool"
else
    echo "--------------------------------------------------------"
    echo "⚠️  Push failed. This usually means you need to authenticate."
    echo "💡 Try running manually: 'git push -u origin main'"
fi
