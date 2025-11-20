@echo off
git add .github/workflows/deploy.yml
git commit -m "Fix: Set cancel-in-progress to false v5.2.3"
git push origin main
echo Done!

