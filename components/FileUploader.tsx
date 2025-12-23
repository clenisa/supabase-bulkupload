'use client'

import { useState, useRef, useCallback } from 'react'
import { uploadFile } from '@/lib/upload'
import ProgressBar from './ProgressBar'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'

function SetupInfo() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <svg
            className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium text-blue-900 dark:text-blue-100">
            Setup Instructions & What to Expect
          </span>
        </div>
        <svg
          className={`h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 space-y-4 text-sm text-blue-800 dark:text-blue-200">
          <div>
            <h3 className="font-semibold mb-2">Environment Variables Setup</h3>
            <p className="mb-2">
              Create a <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded text-xs">.env.local</code> file in your project root with:
            </p>
            <div className="bg-blue-100 dark:bg-blue-900/40 rounded p-3 font-mono text-xs overflow-x-auto">
              <div className="space-y-1">
                <div>NEXT_PUBLIC_SUPABASE_URL=your-project-url</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</div>
                <div className="text-blue-600 dark:text-blue-400 mt-2">
                  # Optional:
                </div>
                <div>NEXT_PUBLIC_STORAGE_BUCKET=uploads</div>
                <div>NEXT_PUBLIC_MAX_FILE_SIZE=5368709120</div>
                <div>NEXT_PUBLIC_CHUNK_SIZE=5242880</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Where to Get Your Supabase Credentials</h3>
            <p className="mb-2">
              Get your project URL and anon key from:{' '}
              <a
                href="https://app.supabase.com/project/_/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-900 dark:hover:text-blue-100"
              >
                Supabase Project Settings → API
              </a>
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Storage Bucket Setup</h3>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Go to Storage in your Supabase dashboard</li>
              <li>Create a new bucket (default: "uploads")</li>
              <li>Set bucket to <strong>Public</strong> or <strong>Private</strong> based on your needs</li>
              <li>If private, ensure RLS policies allow authenticated users to upload</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-2">What to Expect</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong>Resumable Uploads:</strong> Large files can be paused and resumed
              </li>
              <li>
                <strong>Progress Tracking:</strong> Real-time upload progress with speed indicators
              </li>
              <li>
                <strong>File Validation:</strong> Automatic size and format validation
              </li>
              <li>
                <strong>Secure Storage:</strong> Files are stored securely in your Supabase bucket
              </li>
              <li>
                <strong>User Isolation:</strong> Files are organized by user ID
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

interface UploadState {
  file: File | null
  progress: number
  bytesUploaded: number
  bytesTotal: number
  uploadSpeed: number
  isUploading: boolean
  error: string | null
  success: boolean
  fileUrl: string | null
}

export default function FileUploader() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    progress: 0,
    bytesUploaded: 0,
    bytesTotal: 0,
    uploadSpeed: 0,
    isUploading: false,
    error: null,
    success: false,
    fileUrl: null,
  })
  const [isDragging, setIsDragging] = useState(false)
  const speedRef = useRef<{ bytes: number; time: number }>({
    bytes: 0,
    time: Date.now(),
  })

  const handleFileSelect = useCallback((file: File) => {
    setUploadState({
      file,
      progress: 0,
      bytesUploaded: 0,
      bytesTotal: file.size,
      uploadSpeed: 0,
      isUploading: false,
      error: null,
      success: false,
      fileUrl: null,
    })
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = async () => {
    if (!uploadState.file) return

    setUploadState((prev) => ({
      ...prev,
      isUploading: true,
      error: null,
      success: false,
      progress: 0,
      bytesUploaded: 0,
    }))

    speedRef.current = { bytes: 0, time: Date.now() }

    try {
      await uploadFile({
        file: uploadState.file!,
        onProgress: (bytesUploaded, bytesTotal) => {
          const now = Date.now()
          const timeDelta = (now - speedRef.current.time) / 1000 // seconds
          const bytesDelta = bytesUploaded - speedRef.current.bytes

          let uploadSpeed = 0
          if (timeDelta > 0) {
            uploadSpeed = bytesDelta / timeDelta
            speedRef.current = { bytes: bytesUploaded, time: now }
          }

          const progress = (bytesUploaded / bytesTotal) * 100

          setUploadState((prev) => ({
            ...prev,
            progress,
            bytesUploaded,
            bytesTotal,
            uploadSpeed,
          }))
        },
        onSuccess: (url) => {
          setUploadState((prev) => ({
            ...prev,
            isUploading: false,
            success: true,
            fileUrl: url,
          }))
        },
        onError: (error) => {
          setUploadState((prev) => ({
            ...prev,
            isUploading: false,
            error: error.message,
          }))
        },
      })
    } catch (error) {
      setUploadState((prev) => ({
        ...prev,
        isUploading: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }))
    }
  }

  const handleReset = () => {
    setUploadState({
      file: null,
      progress: 0,
      bytesUploaded: 0,
      bytesTotal: 0,
      uploadSpeed: 0,
      isUploading: false,
      error: null,
      success: false,
      fileUrl: null,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth/login')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            File Upload
          </h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Setup Info */}
        <SetupInfo />

        {/* Upload Area */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          {!uploadState.file && !uploadState.isUploading && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-600'
              }`}
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4h12m-4 4v12m0 0v-4a4 4 0 00-4-4h-4m-8 4h4"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Drag and drop your file here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                or
              </p>
              <label className="cursor-pointer">
                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Browse Files
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </label>
            </div>
          )}

          {/* File Selected */}
          {uploadState.file && !uploadState.isUploading && !uploadState.success && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-8 w-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {uploadState.file.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(uploadState.file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleUpload}
                className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Upload File
              </button>
            </div>
          )}

          {/* Upload Progress */}
          {uploadState.isUploading && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <svg
                  className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {uploadState.file?.name}
                  </p>
                  <ProgressBar
                    progress={uploadState.progress}
                    bytesUploaded={uploadState.bytesUploaded}
                    bytesTotal={uploadState.bytesTotal}
                    uploadSpeed={uploadState.uploadSpeed}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadState.success && uploadState.fileUrl && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    Upload successful!
                  </p>
                </div>
                <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                  File URL:{' '}
                  <a
                    href={uploadState.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline break-all"
                  >
                    {uploadState.fileUrl}
                  </a>
                </p>
              </div>
              <button
                onClick={handleReset}
                className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Upload Another File
              </button>
            </div>
          )}

          {/* Error State */}
          {uploadState.error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <p className="text-red-800 dark:text-red-200 font-medium">Upload failed</p>
              </div>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                {uploadState.error}
              </p>
              <button
                onClick={handleReset}
                className="mt-4 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

