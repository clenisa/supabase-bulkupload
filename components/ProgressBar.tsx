'use client'

interface ProgressBarProps {
  progress: number // 0-100
  bytesUploaded: number
  bytesTotal: number
  uploadSpeed?: number // bytes per second
}

export default function ProgressBar({
  progress,
  bytesUploaded,
  bytesTotal,
  uploadSpeed,
}: ProgressBarProps) {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatSpeed = (bytesPerSecond?: number): string => {
    if (!bytesPerSecond) return ''
    return `${formatBytes(bytesPerSecond)}/s`
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{Math.round(progress)}%</span>
        <span>
          {formatBytes(bytesUploaded)} / {formatBytes(bytesTotal)}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {uploadSpeed && uploadSpeed > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-500 text-right">
          {formatSpeed(uploadSpeed)}
        </div>
      )}
    </div>
  )
}

