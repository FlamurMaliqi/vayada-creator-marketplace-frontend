'use client'

import { useState, useRef, useCallback } from 'react'
import { countries } from 'countries-list'
import type {
  CreatorProfile,
  ProfilePlatform,
  CreatorEditFormData,
  PlatformAgeGroup,
  ApiCreatorResponse,
  ApiRatingResponse,
  CreatorUpdatePayload,
} from '@/components/profile/types'
import type { CreatorRating, Creator as ApiCreator } from '@/lib/types'
import { creatorService } from '@/services/api/creators'
import { ApiErrorResponse } from '@/services/api/client'

const COUNTRIES = Object.values(countries).map(country => country.name).sort()

interface UseCreatorProfileEditOptions {
  onError?: (title: string, message: string | string[], details?: string) => void
}

export function useCreatorProfileEdit(options: UseCreatorProfileEditOptions = {}) {
  const { onError } = options

  // Profile state
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Contact state
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [isSavingContact, setIsSavingContact] = useState(false)

  // Form state
  const [editFormData, setEditFormData] = useState<CreatorEditFormData>({
    name: '',
    profilePicture: '',
    shortDescription: '',
    location: '',
    portfolioLink: '',
    platforms: [],
  })

  // Platform UI state
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<number>>(new Set())
  const [platformCountryInputs, setPlatformCountryInputs] = useState<Record<number, string>>({})
  const [platformSaveStatus, setPlatformSaveStatus] = useState<Record<number, string>>({})

  // Image state
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const [showPictureModal, setShowPictureModal] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Transform API response to CreatorProfile
  const transformCreatorProfile = useCallback((apiCreator: ApiCreatorResponse): CreatorProfile => {
    const profilePicture = (apiCreator.profilePicture || apiCreator.profile_picture || '').trim() || undefined
    const shortDescription = apiCreator.shortDescription || apiCreator.short_description || ''
    const portfolioLink = apiCreator.portfolioLink || apiCreator.portfolio_link || undefined

    const platforms: ProfilePlatform[] = (apiCreator.platforms || []).map((platform) => {
      let genderSplit = { male: 0, female: 0 }
      const rawGenderSplit = platform.genderSplit || platform.gender_split
      if (typeof rawGenderSplit === 'string') {
        try { genderSplit = JSON.parse(rawGenderSplit) } catch { /* use default */ }
      } else if (rawGenderSplit && typeof rawGenderSplit === 'object') {
        genderSplit = rawGenderSplit
      }

      const topAgeGroups = (platform.topAgeGroups || platform.top_age_groups || [])
        .map((ag) => ({
          ageRange: String(ag.ageRange ?? ag.age_range ?? '').trim(),
          percentage: ag.percentage ?? 0,
        }))
        .filter((ag): ag is PlatformAgeGroup => ag.ageRange !== '' && ag.ageRange !== 'null')

      return {
        id: platform.id,
        name: platform.name,
        handle: platform.handle || '',
        followers: platform.followers ?? 0,
        engagementRate: (platform.engagementRate || platform.engagement_rate) ?? 0,
        topCountries: platform.topCountries || platform.top_countries || [],
        topAgeGroups,
        genderSplit,
      }
    })

    const ratingData: ApiRatingResponse = apiCreator.rating || {}
    const rating: CreatorRating = {
      averageRating: ratingData.averageRating ?? ratingData.average_rating ?? 0,
      totalReviews: ratingData.totalReviews ?? ratingData.total_reviews ?? 0,
      reviews: ratingData.reviews || [],
    }

    return {
      id: apiCreator.id || '',
      name: apiCreator.name || '',
      profilePicture,
      shortDescription,
      location: apiCreator.location || '',
      status: apiCreator.status || 'pending',
      rating,
      platforms,
      portfolioLink,
      email: apiCreator.email || '',
      phone: apiCreator.phone || '',
    }
  }, [])

  // Load profile
  const loadProfile = useCallback(async () => {
    try {
      const apiProfile = await creatorService.getMyProfile()
      const profile = transformCreatorProfile(apiProfile as unknown as ApiCreatorResponse)
      setCreatorProfile(profile)
      setEmail(profile.email)
      setPhone(profile.phone || '')

      // Initialize edit form
      setEditFormData({
        name: profile.name,
        profilePicture: profile.profilePicture || '',
        shortDescription: profile.shortDescription,
        location: profile.location,
        portfolioLink: profile.portfolioLink || '',
        platforms: profile.platforms.map(p => ({
          ...p,
          topAgeGroups: (p.topAgeGroups || []).filter(ag => ag.ageRange && ag.ageRange !== '' && ag.ageRange !== 'null'),
        })),
      })
      setExpandedPlatforms(new Set())
      setPlatformCountryInputs({})

      return profile
    } catch (error) {
      if (error instanceof ApiErrorResponse && error.status === 405) {
        console.warn('Profile endpoint not yet implemented')
      } else {
        console.error('Failed to fetch creator profile:', error)
      }
      return null
    }
  }, [transformCreatorProfile])

  // Validation
  const validateForm = useCallback((): string | null => {
    if (!editFormData.name.trim()) return 'Name is required'
    if (!editFormData.location.trim()) return 'Location is required'
    if (!editFormData.shortDescription.trim()) return 'Short description is required'
    if (editFormData.shortDescription.trim().length < 10) return 'Short description must be at least 10 characters'
    if (editFormData.shortDescription.trim().length > 500) return 'Short description must be at most 500 characters'
    if (editFormData.portfolioLink && !editFormData.portfolioLink.match(/^https?:\/\//)) {
      return 'Portfolio link must start with http:// or https://'
    }
    if (editFormData.platforms.length === 0) return 'At least one platform is required'

    for (let i = 0; i < editFormData.platforms.length; i++) {
      const p = editFormData.platforms[i]
      if (!p.name) return `Platform ${i + 1}: Platform name is required`
      if (!p.handle.trim()) return `Platform ${i + 1}: Handle is required`
      if (!p.followers || p.followers <= 0) return `Platform ${i + 1}: Followers must be greater than 0`
      if (!p.engagementRate || p.engagementRate <= 0) return `Platform ${i + 1}: Engagement rate must be greater than 0`
    }
    return null
  }, [editFormData])

  // Save profile
  const saveProfile = useCallback(async () => {
    const validationError = validateForm()
    if (validationError) {
      onError?.('Validation Error', validationError)
      return false
    }

    setIsSavingProfile(true)
    try {
      // Upload picture if changed
      let profilePictureUrl: string | undefined
      if (profilePictureFile) {
        try {
          const uploadResponse = await creatorService.uploadProfilePicture(profilePictureFile)
          profilePictureUrl = uploadResponse.url
        } catch (error) {
          const detail = error instanceof ApiErrorResponse ? error.data.detail : null
          onError?.('Failed to Upload Image', typeof detail === 'string' ? detail : 'Failed to upload profile picture')
          setIsSavingProfile(false)
          return false
        }
      }

      // Build update payload
      const platforms = editFormData.platforms.map(platform => {
        const validAgeGroups = (platform.topAgeGroups || [])
          .filter((tag): tag is PlatformAgeGroup => {
            const ageRange = tag.ageRange?.trim() || ''
            return ageRange !== '' && ageRange !== 'null'
          })
          .map(tag => ({ ageRange: tag.ageRange.trim(), percentage: tag.percentage }))

        return {
          name: platform.name as 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook',
          handle: platform.handle.trim(),
          followers: platform.followers,
          engagement_rate: platform.engagementRate,
          ...(platform.topCountries && platform.topCountries.length > 0 && {
            top_countries: platform.topCountries,
          }),
          ...(validAgeGroups.length > 0 && { topAgeGroups: validAgeGroups }),
          ...(platform.genderSplit && (platform.genderSplit.male > 0 || platform.genderSplit.female > 0) && {
            gender_split: platform.genderSplit,
          }),
        }
      })

      const audienceSize = platforms.reduce((sum, p) => sum + p.followers, 0)

      const updatePayload: CreatorUpdatePayload = {
        name: editFormData.name.trim(),
        location: editFormData.location.trim(),
        short_description: editFormData.shortDescription.trim(),
        platforms,
        audience_size: audienceSize,
        ...(editFormData.portfolioLink?.trim() && { portfolio_link: editFormData.portfolioLink.trim() }),
        ...(phone?.trim() && { phone: phone.trim() }),
        ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
      }

      const updatedProfile = await creatorService.updateMyProfile(updatePayload as unknown as Partial<ApiCreator>)

      // Update local state
      const responseWithSnakeCase = updatedProfile as ApiCreator & { profile_picture?: string | null }
      const pictureUrl = updatedProfile.profilePicture || responseWithSnakeCase.profile_picture
      if (pictureUrl?.trim()) {
        setEditFormData(prev => ({ ...prev, profilePicture: pictureUrl }))
        if (creatorProfile) {
          setCreatorProfile(prev => prev ? { ...prev, profilePicture: pictureUrl } : null)
        }
      }

      // Reload profile
      await loadProfile()
      setProfilePictureFile(null)
      setProfilePicturePreview(null)
      setIsEditingProfile(false)

      return true
    } catch (error) {
      const detail = error instanceof ApiErrorResponse ? error.data.detail : null
      const message = typeof detail === 'string' ? detail : 'Failed to save profile'
      onError?.('Failed to Save Profile', message)
      return false
    } finally {
      setIsSavingProfile(false)
    }
  }, [editFormData, phone, profilePictureFile, creatorProfile, validateForm, loadProfile, onError])

  // Cancel edit
  const cancelEdit = useCallback(() => {
    if (creatorProfile) {
      setEditFormData({
        name: creatorProfile.name,
        profilePicture: creatorProfile.profilePicture || '',
        shortDescription: creatorProfile.shortDescription,
        location: creatorProfile.location,
        portfolioLink: creatorProfile.portfolioLink || '',
        platforms: creatorProfile.platforms.map(p => ({
          ...p,
          topAgeGroups: (p.topAgeGroups || []).filter(ag => ag.ageRange && ag.ageRange !== ''),
        })),
      })
    }
    setIsEditingProfile(false)
    setProfilePictureFile(null)
    setProfilePicturePreview(null)
  }, [creatorProfile])

  // Save contact
  const saveContact = useCallback(async () => {
    if (!creatorProfile) return false

    setIsSavingContact(true)
    try {
      await creatorService.updateMyProfile({ phone: phone.trim() } as Partial<ApiCreator>)
      setCreatorProfile(prev => prev ? { ...prev, phone: phone.trim() } : null)
      setIsEditingContact(false)
      return true
    } catch (error) {
      const detail = error instanceof ApiErrorResponse ? error.data.detail : null
      onError?.('Failed to Save Contact Information', typeof detail === 'string' ? detail : 'Failed to save contact information')
      return false
    } finally {
      setIsSavingContact(false)
    }
  }, [creatorProfile, phone, onError])

  // Image handlers
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      onError?.('Invalid File', 'Please upload an image file (JPG, PNG, WebP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      onError?.('File Too Large', 'Image must be less than 5MB')
      return
    }

    setProfilePictureFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfilePicturePreview(reader.result as string)
      setShowPictureModal(true)
    }
    reader.readAsDataURL(file)
  }, [onError])

  const confirmPicture = useCallback(() => {
    if (profilePicturePreview) {
      setEditFormData(prev => ({ ...prev, profilePicture: profilePicturePreview }))
    }
    setShowPictureModal(false)
  }, [profilePicturePreview])

  // Platform expansion
  const togglePlatformExpanded = useCallback((index: number) => {
    setExpandedPlatforms(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }, [])

  // Country input
  const handleCountryInputChange = useCallback((platformIndex: number, value: string) => {
    setPlatformCountryInputs(prev => ({ ...prev, [platformIndex]: value }))
  }, [])

  const getAvailableCountries = useCallback((platformIndex: number) => {
    const input = platformCountryInputs[platformIndex] || ''
    const existing = editFormData.platforms[platformIndex]?.topCountries?.map(c => c.country) || []
    return COUNTRIES.filter(c => !existing.includes(c) && c.toLowerCase().includes(input.toLowerCase()))
  }, [platformCountryInputs, editFormData.platforms])

  // Age group toggle
  const toggleAgeGroupTag = useCallback((platformIndex: number, ageRange: string) => {
    setEditFormData(prev => {
      const platforms = [...prev.platforms]
      const platform = { ...platforms[platformIndex] }
      const current = platform.topAgeGroups || []

      if (current.some(ag => ag.ageRange === ageRange)) {
        platform.topAgeGroups = current.filter(ag => ag.ageRange !== ageRange)
      } else {
        platform.topAgeGroups = [...current, { ageRange, percentage: 0 }]
      }

      platforms[platformIndex] = platform
      return { ...prev, platforms }
    })
  }, [])

  // Update platform field
  const updatePlatformField = useCallback((index: number, field: keyof ProfilePlatform, value: unknown) => {
    setEditFormData(prev => {
      const platforms = [...prev.platforms]
      platforms[index] = { ...platforms[index], [field]: value }
      return { ...prev, platforms }
    })
  }, [])

  // Add country to platform
  const addCountryToPlatform = useCallback((platformIndex: number, country: string) => {
    setEditFormData(prev => {
      const platforms = [...prev.platforms]
      const platform = { ...platforms[platformIndex] }
      const current = platform.topCountries || []
      if (!current.some(c => c.country === country)) {
        platform.topCountries = [...current, { country, percentage: 0 }]
      }
      platforms[platformIndex] = platform
      return { ...prev, platforms }
    })
    setPlatformCountryInputs(prev => ({ ...prev, [platformIndex]: '' }))
  }, [])

  // Remove country from platform
  const removeCountryFromPlatform = useCallback((platformIndex: number, country: string) => {
    setEditFormData(prev => {
      const platforms = [...prev.platforms]
      const platform = { ...platforms[platformIndex] }
      platform.topCountries = (platform.topCountries || []).filter(c => c.country !== country)
      platforms[platformIndex] = platform
      return { ...prev, platforms }
    })
  }, [])

  // Update country percentage
  const updateCountryPercentage = useCallback((platformIndex: number, country: string, percentage: number) => {
    setEditFormData(prev => {
      const platforms = [...prev.platforms]
      const platform = { ...platforms[platformIndex] }
      platform.topCountries = (platform.topCountries || []).map(c =>
        c.country === country ? { ...c, percentage } : c
      )
      platforms[platformIndex] = platform
      return { ...prev, platforms }
    })
  }, [])

  // Update gender split
  const updateGenderSplit = useCallback((platformIndex: number, gender: 'male' | 'female', value: number) => {
    setEditFormData(prev => {
      const platforms = [...prev.platforms]
      const platform = { ...platforms[platformIndex] }
      platform.genderSplit = { ...(platform.genderSplit || { male: 0, female: 0 }), [gender]: value }
      platforms[platformIndex] = platform
      return { ...prev, platforms }
    })
  }, [])

  return {
    // Profile state
    creatorProfile,
    setCreatorProfile,
    loadProfile,

    // Edit state
    isEditingProfile,
    setIsEditingProfile,
    isSavingProfile,
    editFormData,
    setEditFormData,
    saveProfile,
    cancelEdit,
    validateForm,

    // Contact state
    email,
    setEmail,
    phone,
    setPhone,
    isEditingContact,
    setIsEditingContact,
    isSavingContact,
    saveContact,

    // Platform state
    expandedPlatforms,
    togglePlatformExpanded,
    platformCountryInputs,
    handleCountryInputChange,
    getAvailableCountries,
    platformSaveStatus,

    // Platform actions
    toggleAgeGroupTag,
    updatePlatformField,
    addCountryToPlatform,
    removeCountryFromPlatform,
    updateCountryPercentage,
    updateGenderSplit,

    // Image state
    profilePictureFile,
    profilePicturePreview,
    showPictureModal,
    setShowPictureModal,
    imageInputRef,
    handleImageChange,
    confirmPicture,
  }
}
