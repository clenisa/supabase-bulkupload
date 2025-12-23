# Supabase Large File Upload Template

A production-ready Next.js template for uploading large files to Supabase Storage with resumable uploads, authentication, and a modern drag-and-drop interface.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)

## ✨ Features

- ✅ **Resumable Uploads**: Uses TUS protocol for reliable large file uploads
- ✅ **Authentication**: Built-in Supabase authentication (email/password)
- ✅ **Progress Tracking**: Real-time upload progress with speed indicators
- ✅ **Drag & Drop**: Intuitive file upload interface
- ✅ **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- ✅ **Error Handling**: Robust error handling with retry logic
- ✅ **Best Practices**: Follows Supabase and Next.js best practices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- Git installed

### Installation

1. **Fork this repository** (click the Fork button at the top)

2. **Clone your fork:**
```bash
git clone https://github.com/YOUR_USERNAME/supabase-file-upload-template.git
cd supabase-file-upload-template
```

3. **Install dependencies:**
```bash
npm install
```

4. **Set up Supabase:**
   - Create a new project at [Supabase Dashboard](https://app.supabase.com)
   - Create a storage bucket named `uploads` (or your preferred name)
   - Set up Row Level Security (RLS) policies (see [Setup Guide](#setup-guide) below)

5. **Configure environment variables:**
```bash
# Copy the example file
cp env.example .env.local

# Edit .env.local and add your Supabase credentials
# Get these from: https://app.supabase.com/project/_/settings/api
```

6. **Run the development server:**
```bash
npm run dev
```

7. **Open [http://localhost:3000](http://localhost:3000)** and start uploading!

## 📖 Setup Guide

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in your project details:
   - **Name**: Your project name
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### Step 2: Get Your Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy your **Project URL** (e.g., `https://xxxxx.supabase.co`)
3. Copy your **anon public key** (starts with `eyJ...`)

### Step 3: Create Storage Bucket

1. In Supabase dashboard, click **"Storage"** in the left sidebar
2. Click **"New bucket"**
3. Configure:
   - **Name**: `uploads` (or update `NEXT_PUBLIC_STORAGE_BUCKET` in `.env.local`)
   - **Public bucket**: Leave **unchecked** (private is recommended for security)
4. Click **"Create bucket"**

### Step 4: Set Up Row Level Security (RLS) Policies

1. In Storage, click on your bucket name
2. Click the **"Policies"** tab
3. Create three policies:

#### Policy 1: Allow Uploads
- **Policy name**: `Allow authenticated uploads`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
bucket_id = 'uploads' AND auth.role() = 'authenticated'
```

#### Policy 2: Allow Reads
- **Policy name**: `Allow authenticated reads`
- **Allowed operation**: `SELECT`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
bucket_id = 'uploads' AND auth.role() = 'authenticated'
```

#### Policy 3: Allow Deletes
- **Policy name**: `Allow authenticated deletes`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **Policy definition**:
```sql
bucket_id = 'uploads' AND auth.role() = 'authenticated'
```

> 💡 **Tip**: You can also run the SQL migration in `supabase/migrations/001_create_bucket.sql` (note: bucket creation must be done manually in the dashboard).

### Step 5: Configure Environment Variables

1. Copy the example file:
```bash
cp env.example .env.local
```

2. Open `.env.local` and update with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

3. Optional: Adjust file size limits:
```env
NEXT_PUBLIC_MAX_FILE_SIZE=5368709120  # 5GB in bytes
NEXT_PUBLIC_CHUNK_SIZE=5242880        # 5MB in bytes
```

### Step 6: Create Your First User

1. Start the dev server: `npm run dev`
2. Navigate to [http://localhost:3000](http://localhost:3000)
3. Click **"Sign up"** to create an account
4. If email confirmation is enabled, check your email and confirm
5. Sign in and start uploading!

> 💡 **Disable email confirmation** (for testing): Go to Supabase Dashboard → Authentication → Settings → Toggle off "Enable email confirmations"

## 📁 Project Structure

```
├── app/
│   ├── auth/
│   │   ├── login/          # Login/signup page
│   │   └── callback/        # OAuth callback handler
│   ├── upload/              # Main upload page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── FileUploader.tsx     # Main upload component
│   └── ProgressBar.tsx      # Progress indicator
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Client-side Supabase client
│   │   └── server.ts        # Server-side Supabase client
│   ├── upload.ts            # Upload logic with TUS
│   └── auth.ts              # Auth utilities
├── supabase/
│   └── migrations/          # SQL migrations
├── env.example              # Environment variables template
├── README.md                # This file
└── SETUP.md                 # Detailed setup guide
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | - | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | - | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side ops) | - | ❌ No |
| `NEXT_PUBLIC_STORAGE_BUCKET` | Storage bucket name | `uploads` | ❌ No |
| `NEXT_PUBLIC_MAX_FILE_SIZE` | Max file size in bytes | `5368709120` (5GB) | ❌ No |
| `NEXT_PUBLIC_CHUNK_SIZE` | Upload chunk size in bytes | `5242880` (5MB) | ❌ No |

### File Size Limits

The default maximum file size is **5GB**. To change:

1. Update `NEXT_PUBLIC_MAX_FILE_SIZE` in `.env.local` (in bytes)
2. Update your Supabase storage bucket settings if needed

### Chunk Size

- **Default**: 5MB chunks
- **Larger chunks** = Faster uploads, less granular progress
- **Smaller chunks** = More granular progress, potentially slower

## 🔧 How It Works

### Architecture

```
User → Next.js Frontend → Supabase Auth → Supabase Storage
                              ↓
                        TUS Protocol
                        (Resumable Uploads)
```

### Upload Flow

1. User authenticates with Supabase
2. User selects/drops a file
3. File is validated (size, type)
4. Upload starts using TUS protocol
5. File is chunked and uploaded with progress tracking
6. On completion, user receives the file URL

### Resumable Uploads

This template uses the [TUS protocol](https://tus.io/) for resumable uploads:

- ✅ Uploads can be resumed if interrupted
- ✅ No need to re-upload the entire file
- ✅ Automatic retry logic handles network issues

## 🐛 Troubleshooting

### "Missing Supabase environment variables" Error

- ✅ Make sure `.env.local` exists in the project root
- ✅ Verify variable names match exactly (no typos)
- ✅ Restart the dev server after changing `.env.local`

### "Not authenticated" Error

- ✅ Make sure you're signed in
- ✅ Check that your session hasn't expired
- ✅ Try signing out and signing back in

### Upload Fails

- ✅ Check browser console (F12) for error messages
- ✅ Verify bucket name matches in `.env.local`
- ✅ Ensure RLS policies are set up correctly
- ✅ Check that file size is under the limit

### Progress Bar Not Updating

- ✅ Check browser console for errors
- ✅ Verify TUS protocol is working (check Network tab)
- ✅ Ensure chunk size is appropriate for your file size

### Can't Sign Up

- ✅ Check Supabase dashboard → Authentication → Users for errors
- ✅ Verify email confirmation settings
- ✅ Check browser console for errors

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- Railway
- Any platform supporting Next.js

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [TUS Protocol Documentation](https://tus.io/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [TUS](https://tus.io/) for the resumable upload protocol
- [Next.js](https://nextjs.org) for the React framework

## 💬 Support

For issues and questions:
- 📖 Check the [SETUP.md](SETUP.md) for detailed setup instructions
- 🐛 Open an issue on GitHub
- 💬 Check the [Supabase Discord](https://discord.supabase.com)

---

**Made with ❤️ for easy large file uploads**
