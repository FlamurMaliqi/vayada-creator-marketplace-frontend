'use client'

import { useState, useCallback } from 'react'

interface UseImageUploadOptions {
  maxSizeMB?: number
  allowedTypes?: string[]
  onError?: (message: string) => void
}

interface UseImageUploadReturn {
  file: File | null
  preview: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearFile: () => void
  setPreview: (url: string) => void
}

export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const {
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    onError,
  } = options

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const selectedFile = files[0]

    // Validate file type
    if (!allowedTypes.some(type => selectedFile.type.startsWith(type.replace('/*', '')))) {
      onError?.('Please upload an image file (JPG, PNG, WebP)')
      return
    }

    // Validate file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      onError?.(`Image must be less than ${maxSizeMB}MB`)
      return
    }

    // Store the File object for upload
    setFile(selectedFile)

    // Create preview for display
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }, [allowedTypes, maxSizeMB, onError])

  const clearFile = useCallback(() => {
    setFile(null)
    setPreview('')
  }, [])

  return {
    file,
    preview,
    handleChange,
    clearFile,
    setPreview,
  }
}

interface UseMultipleImageUploadOptions {
  maxImages?: number
  maxSizeMB?: number
  allowedTypes?: string[]
  onError?: (message: string) => void
}

interface UseMultipleImageUploadReturn {
  files: File[]
  previews: string[]
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, existingImages?: string[]) => void
  removeImage: (index: number) => void
  clearFiles: () => void
  setFiles: (files: File[]) => void
  setPreviews: (urls: string[]) => void
}

export function useMultipleImageUpload(
  options: UseMultipleImageUploadOptions = {}
): UseMultipleImageUploadReturn {
  const {
    maxImages = 10,
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    onError,
  } = options

  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    existingImages: string[] = []
  ) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    const fileArray = Array.from(selectedFiles)
    const currentTotal = existingImages.length + files.length

    // Validate total count
    if (currentTotal + fileArray.length > maxImages) {
      onError?.(`Maximum ${maxImages} images allowed`)
      e.target.value = ''
      return
    }

    // Validate all files first
    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        onError?.('Please upload image files only (JPG, PNG, WebP)')
        e.target.value = ''
        return
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        onError?.(`Image must be less than ${maxSizeMB}MB`)
        e.target.value = ''
        return
      }
    }

    // Process all files
    let processedCount = 0
    const newImages: string[] = []
    const newFiles: File[] = []

    fileArray.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newImages.push(reader.result as string)
        newFiles.push(file)
        processedCount++

        // When all files are processed, update state once
        if (processedCount === fileArray.length) {
          setPreviews(prev => [...prev, ...newImages])
          setFiles(prev => [...prev, ...newFiles])
        }
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    e.target.value = ''
  }, [files.length, maxImages, maxSizeMB, onError])

  const removeImage = useCallback((index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
    setFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearFiles = useCallback(() => {
    setFiles([])
    setPreviews([])
  }, [])

  return {
    files,
    previews,
    handleChange,
    removeImage,
    clearFiles,
    setFiles,
    setPreviews,
  }
}
