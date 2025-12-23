# Step-by-Step Setup Guide

This guide will walk you through setting up the Supabase File Upload Template from scratch.

## Step 1: Fork and Clone the Repository

1. Click the "Fork" button on the GitHub repository page
2. Clone your forked repository:
```bash
git clone https://github.com/your-username/supabase-file-upload-template.git
cd supabase-file-upload-template
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Supabase client, and TUS client.

## Step 3: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in:
   - **Name**: Your project name
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region
   - **Pricing Plan**: Free tier is fine for testing
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be provisioned

## Step 4: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon)
2. Click **"API"** in the left sidebar
3. You'll see:
   - **Project URL**: Copy this (e.g., `https://xxxxx.supabase.co`)
   - **anon public key**: Copy this (starts with `eyJ...`)

Keep these handy for the next step!

## Step 5: Create a Storage Bucket

1. In your Supabase dashboard, click **"Storage"** in the left sidebar
2. Click **"New bucket"**
3. Fill in:
   - **Name**: `uploads` (or any name you prefer)
   - **Public bucket**: Leave unchecked (we want private for security)
4. Click **"Create bucket"**

## Step 6: Set Up Row Level Security (RLS) Policies

1. Still in Storage, click on your bucket name (`uploads`)
2. Click the **"Policies"** tab
3. Click **"New Policy"**

### Policy 1: Allow Uploads

- **Policy name**: `Allow authenticated uploads`
- **Allowed operation**: Select **"INSERT"**
- **Target roles**: Select **"authenticated"**
- **Policy definition**: Paste this SQL:
```sql
bucket_id = 'uploads' AND auth.role() = 'authenticated'
```
(Replace `'uploads'` with your bucket name if different)

Click **"Review"** then **"Save policy"**

### Policy 2: Allow Reads

- **Policy name**: `Allow authenticated reads`
- **Allowed operation**: Select **"SELECT"**
- **Target roles**: Select **"authenticated"**
- **Policy definition**:
```sql
bucket_id = 'uploads' AND auth.role() = 'authenticated'
```

Click **"Review"** then **"Save policy"**

### Policy 3: Allow Deletes

- **Policy name**: `Allow authenticated deletes`
- **Allowed operation**: Select **"DELETE"**
- **Target roles**: Select **"authenticated"**
- **Policy definition**:
```sql
bucket_id = 'uploads' AND auth.role() = 'authenticated'
```

Click **"Review"** then **"Save policy"**

## Step 7: Configure Environment Variables

1. In your project root, copy the example file:
```bash
cp .env.example .env.local
```

2. Open `.env.local` in your code editor

3. Update the values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

Replace:
- `https://your-project-ref.supabase.co` with your Project URL from Step 4
- `your-anon-key-here` with your anon public key from Step 4
- `uploads` with your bucket name if you used a different name

Optional: Adjust file size limits if needed:
- `NEXT_PUBLIC_MAX_FILE_SIZE=5368709120` (5GB in bytes)
- `NEXT_PUBLIC_CHUNK_SIZE=5242880` (5MB in bytes)

## Step 8: Start the Development Server

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
```

## Step 9: Create Your First User Account

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You'll be redirected to the login page
3. Click **"Don't have an account? Sign up"**
4. Enter your email and password
5. Click **"Sign up"**

### Email Confirmation (if enabled)

If email confirmation is enabled in your Supabase project:
1. Check your email for a confirmation link
2. Click the link to confirm your account
3. Return to the app and sign in

To disable email confirmation (for testing):
1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Under **"Email Auth"**, toggle off **"Enable email confirmations"**
3. Save changes

## Step 10: Upload Your First File

1. After signing in, you'll see the upload page
2. Either:
   - Drag and drop a file onto the upload area, or
   - Click **"Browse Files"** to select a file
3. Click **"Upload File"**
4. Watch the progress bar as your file uploads!
5. Once complete, you'll see a success message with the file URL

## Troubleshooting

### "Missing Supabase environment variables" Error

- Make sure `.env.local` exists in the project root
- Verify the variable names match exactly (no typos)
- Restart the dev server after changing `.env.local`

### "Not authenticated" Error

- Make sure you're signed in
- Check that your session hasn't expired
- Try signing out and signing back in

### Upload Fails

- Check the browser console (F12) for error messages
- Verify your bucket name matches in `.env.local`
- Ensure RLS policies are set up correctly
- Check that the file size is under the limit

### Can't Sign Up

- Check Supabase dashboard → **Authentication** → **Users** for any errors
- Verify email confirmation settings
- Check browser console for errors

## Next Steps

- Customize the UI to match your brand
- Add file type restrictions if needed
- Implement file listing/downloading
- Add user-specific file organization
- Set up production deployment

## Need Help?

- Check the main [README.md](README.md) for more details
- Review [Supabase Documentation](https://supabase.com/docs)
- Open an issue on GitHub

