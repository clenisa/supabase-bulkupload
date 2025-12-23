import * as tus from 'tus-js-client'
import { supabase } from './supabase/client'

const BUCKET_NAME = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'uploads'
const MAX_FILE_SIZE =
  parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5368709120') || 5368709120 // 5GB default
const CHUNK_SIZE =
  parseInt(process.env.NEXT_PUBLIC_CHUNK_SIZE || '5242880') || 5242880 // 5MB default

export interface UploadOptions {
  file: File
  onProgress?: (bytesUploaded: number, bytesTotal: number) => void
  onSuccess?: (url: string) => void
  onError?: (error: Error) => void
}

export interface UploadResult {
  url: string
  path: string
}

/**
 * Validates file before upload
 */
function validateFile(file: File): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024 / 1024}GB`
    )
  }

  if (file.size === 0) {
    throw new Error('File is empty')
  }
}

/**
 * Sanitizes file name to prevent path traversal and other security issues
 */
function sanitizeFileName(fileName: string): string {
  // Remove path separators and dangerous characters
  return fileName
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Gets the direct storage URL for better performance with large files
 */
function getStorageUrl(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // Extract project ref from URL (e.g., https://xxxxx.supabase.co)
  const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)
  if (urlMatch) {
    const projectRef = urlMatch[1]
    return `https://${projectRef}.supabase.co/storage/v1`
  }
  // Fallback to standard URL
  return `${supabaseUrl}/storage/v1`
}

/**
 * Gets upload URL and token for TUS upload
 */
async function getUploadMetadata(fileName: string): Promise<{
  uploadUrl: string
  token: string
  filePath: string
}> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Not authenticated')
  }

  // Get the storage URL
  const storageUrl = getStorageUrl()

  // Create a path for the file (you can customize this)
  const filePath = `${session.user.id}/${Date.now()}-${sanitizeFileName(fileName)}`

  return {
    uploadUrl: `${storageUrl}/upload/resumable`,
    token: session.access_token,
    filePath,
  }
}

/**
 * Uploads a file using TUS protocol for resumable uploads
 */
export async function uploadFile({
  file,
  onProgress,
  onSuccess,
  onError,
}: UploadOptions): Promise<UploadResult> {
  try {
    // Validate file
    validateFile(file)

    // Get upload metadata
    const { uploadUrl, token, filePath } = await getUploadMetadata(file.name)

    return new Promise((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: uploadUrl,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        chunkSize: CHUNK_SIZE,
        headers: {
          authorization: `Bearer ${token}`,
          'x-upsert': 'true', // Allow overwriting
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        metadata: {
          filename: file.name,
          filetype: file.type,
          bucketName: BUCKET_NAME,
          objectName: filePath,
        },
        onError: (error) => {
          const err = new Error(`Upload failed: ${error.message}`)
          onError?.(err)
          reject(err)
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          onProgress?.(bytesUploaded, bytesTotal)
        },
        onSuccess: async () => {
          try {
            // Get URL for the uploaded file
            // For private buckets, we'll use a signed URL
            // For public buckets, we can use getPublicUrl
            const {
              data: { publicUrl },
            } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

            // If bucket is private, create a signed URL instead
            // Note: For private buckets, you may want to use createSignedUrl
            // const { data: signedData } = await supabase.storage
            //   .from(BUCKET_NAME)
            //   .createSignedUrl(filePath, 3600) // 1 hour expiry
            // const url = signedData?.signedUrl || publicUrl

            const result: UploadResult = {
              url: publicUrl,
              path: filePath,
            }

            onSuccess?.(result.url)
            resolve(result)
          } catch (error) {
            const err =
              error instanceof Error
                ? error
                : new Error('Failed to get file URL')
            onError?.(err)
            reject(err)
          }
        },
      })

      // Check if there are any previous uploads to continue
      upload.findPreviousUploads().then((previousUploads) => {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0])
        }
        upload.start()
      })
    })
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Upload failed')
    onError?.(err)
    throw err
  }
}

