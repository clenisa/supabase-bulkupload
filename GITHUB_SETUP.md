# GitHub Repository Setup Guide

This guide will help you set up repository topics and branch protection rules for your GitHub repository.

## Setting Up Repository Topics

Repository topics help others discover your project. Follow these steps:

1. Go to your repository: https://github.com/clenisa/supabase-bulkupload
2. Click on the gear icon (⚙️) next to "About" section, or scroll down to the "About" section
3. In the "Topics" field, add the following topics (press Enter after each):
   - `nextjs`
   - `supabase`
   - `file-upload`
   - `typescript`
   - `tus-protocol`
   - `resumable-uploads`
   - `react`
   - `tailwindcss`
   - `authentication`
   - `storage`
   - `template`
   - `boilerplate`

4. Click "Save changes"

## Setting Up Branch Protection Rules

Branch protection rules help maintain code quality and prevent accidental deletions. Here's how to set them up:

### Step 1: Navigate to Branch Protection Settings

1. Go to your repository: https://github.com/clenisa/supabase-bulkupload
2. Click on **"Settings"** (top menu bar)
3. Click on **"Branches"** in the left sidebar
4. Under **"Branch protection rules"**, click **"Add rule"**

### Step 2: Configure Protection Rules

1. **Branch name pattern**: Enter `main` (or `master` if that's your default branch)

2. **Protect matching branches**: Check the following options:

   ✅ **Require a pull request before merging**
      - Check "Require approvals" and set to **1** approval
      - Optionally check "Dismiss stale pull request approvals when new commits are pushed"
      - Optionally check "Require review from Code Owners" (if you set up CODEOWNERS)

   ✅ **Require status checks to pass before merging**
      - (Optional) Add required status checks if you set up CI/CD

   ✅ **Require conversation resolution before merging**
      - Ensures all comments are addressed

   ✅ **Require signed commits**
      - (Optional) Requires commits to be signed

   ✅ **Require linear history**
      - (Optional) Prevents merge commits

   ✅ **Include administrators**
      - Applies rules to admins too (recommended)

   ✅ **Do not allow bypassing the above settings**
      - Prevents bypassing protection rules

   ✅ **Restrict who can push to matching branches**
      - (Optional) Limit who can push directly

   ✅ **Allow force pushes**
      - **Leave UNCHECKED** (recommended for main branch)

   ✅ **Allow deletions**
      - **Leave UNCHECKED** (prevents accidental branch deletion)

3. Click **"Create"** or **"Save changes"**

### Step 3: Additional Recommendations

- **Add a description**: Go to repository Settings → General → Description
  - Suggested: "A production-ready Next.js template for uploading large files to Supabase Storage with resumable uploads, authentication, and drag-and-drop UI"

- **Add a website URL** (if you deploy it):
  - Go to repository Settings → General → Website
  - Add your deployed URL (e.g., Vercel deployment)

- **Enable Issues and Discussions** (if desired):
  - Go to repository Settings → General → Features
  - Enable "Issues" and optionally "Discussions"

## Quick Setup Checklist

- [ ] Add repository topics (see above)
- [ ] Set up branch protection for `main` branch
- [ ] Add repository description
- [ ] Verify README displays correctly
- [ ] Test that the repository can be forked
- [ ] (Optional) Set up GitHub Actions for CI/CD
- [ ] (Optional) Add a LICENSE file (already included)

## Notes

- Branch protection rules help maintain code quality
- Topics make your repository more discoverable
- These settings can be modified anytime in repository Settings

For more information, see [GitHub's documentation on branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

