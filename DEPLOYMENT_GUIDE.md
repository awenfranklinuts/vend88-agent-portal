# Deployment Guide

This guide explains how to update and deploy both projects in the vend88-agent-portal repository.

## Prerequisites

- Git installed and configured
- AWS CLI installed and configured (for registration form)
- VS Code or any code editor

---

## 1. Agent Portal (portal.vend88.com)

The Agent Portal is deployed on **Vercel** with automatic deployments from GitHub.

### Making Updates

#### Step 1: Make Your Changes
Edit files in `agent-portal-website/` directory as needed.

#### Step 2: Deploy to Production

```powershell
# Navigate to the project root
cd d:\Github\vend88-agent-portal

# Check what changed
git status

# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Description of your changes"

# Push to GitHub
git push origin main
```

#### Step 3: Wait for Automatic Deployment
- Vercel automatically detects the push
- Build and deployment takes 1-3 minutes
- Check status at: https://vercel.com/dashboard
- Your changes will be live at: https://portal.vend88.com

### Quick One-Line Deploy

```powershell
cd d:\Github\vend88-agent-portal; git add .; git commit -m "Your update"; git push
```

### View Deployment Logs
1. Go to https://vercel.com/dashboard
2. Click on **vend88-agent-portal** project
3. View real-time build logs and deployment status

---

## 2. Registration Form (form.vend88.com)

The Registration Form is deployed on **AWS S3 + CloudFront** and requires manual deployment.

### Making Updates

#### Step 1: Make Your Changes
Edit files in `onboarding-registration-form/` directory as needed.

#### Step 2: Build the Project

```powershell
# Navigate to the registration form directory
cd d:\Github\vend88-agent-portal\onboarding-registration-form

# Build the production version
npm run build
```

This creates an `out/` folder with the static files.

#### Step 3: Deploy to AWS S3

```powershell
# Sync files to S3 bucket (deletes removed files)
aws s3 sync out/ s3://onboarding-registration-form --delete
```

#### Step 4: Invalidate CloudFront Cache

```powershell
# Clear CloudFront cache to serve new files immediately
aws cloudfront create-invalidation --distribution-id E3UHMUQXQ9GH4M --paths "/*"
```

#### Step 5: Wait for Cache Invalidation
- Takes 2-5 minutes for CloudFront to update
- Your changes will be live at: https://form.vend88.com

### Complete Deployment Command (All Steps)

```powershell
cd d:\Github\vend88-agent-portal\onboarding-registration-form; npm run build; aws s3 sync out/ s3://onboarding-registration-form --delete; aws cloudfront create-invalidation --distribution-id E3UHMUQXQ9GH4M --paths "/*"
```

### Commit Changes to Git (Optional but Recommended)

```powershell
cd d:\Github\vend88-agent-portal
git add .
git commit -m "Update registration form"
git push origin main
```

---

## Common Workflows

### Update Both Projects at Once

```powershell
# 1. Make changes to both projects
# 2. Commit to git (triggers agent portal deploy)
cd d:\Github\vend88-agent-portal
git add .
git commit -m "Update both projects"
git push

# 3. Manually deploy registration form
cd onboarding-registration-form
npm run build
aws s3 sync out/ s3://onboarding-registration-form --delete
aws cloudfront create-invalidation --distribution-id E3UHMUQXQ9GH4M --paths "/*"
```

### Rollback to Previous Version

#### Agent Portal (Vercel)
1. Go to https://vercel.com/dashboard
2. Click on **vend88-agent-portal**
3. Find the previous successful deployment
4. Click **"..."** menu → **"Redeploy"**

#### Registration Form (S3)
Use git to revert changes, then rebuild and redeploy:
```powershell
cd d:\Github\vend88-agent-portal\onboarding-registration-form
git log  # Find the commit hash you want
git checkout <commit-hash> .
npm run build
aws s3 sync out/ s3://onboarding-registration-form --delete
aws cloudfront create-invalidation --distribution-id E3UHMUQXQ9GH4M --paths "/*"
```

---

## Important Notes

### Agent Portal
- ✅ **Auto-deploys** from GitHub pushes
- ✅ **No manual steps** needed after push
- ✅ **Preview deployments** for pull requests
- ⏱️ Deploy time: 1-3 minutes

### Registration Form
- ⚠️ **Manual deployment** required
- ⚠️ **Must rebuild** before deploying
- ⚠️ **Must invalidate cache** after S3 sync
- ⏱️ Build time: 10-20 seconds
- ⏱️ Cache invalidation: 2-5 minutes

### Environment Variables

#### Agent Portal (Vercel)
Manage at: https://vercel.com → Project Settings → Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_DEFAULT_LANGUAGE`

After changing env vars, redeploy from Vercel dashboard.

#### Registration Form
- No environment variables currently configured
- API endpoints are hardcoded in the code

---

## Troubleshooting

### Agent Portal won't deploy
```powershell
# Check build locally first
cd d:\Github\vend88-agent-portal\agent-portal-website
npm install
npm run build

# If build fails, fix errors before pushing
```

### Registration Form changes not showing
1. **Hard refresh browser:** Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)
2. **Check CloudFront invalidation status:**
   - Go to AWS Console → CloudFront → Invalidations
   - Or wait 5 minutes and try again
3. **Verify S3 files were updated:**
   ```powershell
   aws s3 ls s3://onboarding-registration-form/ --recursive
   ```

### AWS CLI not found
```powershell
# Install AWS CLI v2
# Download from: https://aws.amazon.com/cli/

# Configure credentials
aws configure
# Enter your Access Key ID and Secret Access Key
```

---

## Quick Reference

### Agent Portal Commands
```powershell
cd d:\Github\vend88-agent-portal
git add .
git commit -m "Update message"
git push
# Done! Auto-deploys to portal.vend88.com
```

### Registration Form Commands
```powershell
cd d:\Github\vend88-agent-portal\onboarding-registration-form
npm run build
aws s3 sync out/ s3://onboarding-registration-form --delete
aws cloudfront create-invalidation --distribution-id E3UHMUQXQ9GH4M --paths "/*"
# Wait 2-5 minutes for form.vend88.com to update
```

---

## Live URLs

- **Agent Portal:** https://portal.vend88.com
- **Registration Form:** https://form.vend88.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **AWS Console:** https://console.aws.amazon.com

---

*Last Updated: December 14, 2025*
