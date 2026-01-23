'use client'

import { useState, useRef, useCallback } from 'react'
import { countries } from 'countries-list'
import type {
  ProfileHotelProfile,
  ProfileHotelListing,
  HotelEditFormData,
  ListingFormData,
  DeleteConfirmModalState,
} from '@/components/profile/types'
import type { HotelProfile as ApiHotelProfile, CreatorRequirements } from '@/lib/types'
import { hotelService } from '@/services/api/hotels'
import { ApiErrorResponse } from '@/services/api/client'

const COUNTRIES = Object.values(countries).map(country => country.name).sort()

const EMPTY_LISTING_FORM: ListingFormData = {
  name: '',
  location: '',
  description: '',
  images: [],
  accommodationType: '',
  collaborationTypes: [],
  availability: [],
  platforms: [],
  freeStayMinNights: undefined,
  freeStayMaxNights: undefined,
  paidMaxAmount: undefined,
  discountPercentage: undefined,
  lookingForPlatforms: [],
  lookingForMinFollowers: undefined,
  targetGroupCountries: [],
  targetGroupAgeMin: undefined,
  targetGroupAgeMax: undefined,
  targetGroupAgeGroups: [],
}

interface UseHotelProfileEditOptions {
  onError?: (title: string, message: string | string[], details?: string) => void
}

export function useHotelProfileEdit(options: UseHotelProfileEditOptions = {}) {
  const { onError } = options

  // Profile state
  const [hotelProfile, setHotelProfile] = useState<ProfileHotelProfile | null>(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Contact state
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [isSavingContact, setIsSavingContact] = useState(false)

  // Form state
  const [editFormData, setEditFormData] = useState<HotelEditFormData>({
    name: '',
    picture: '',
    location: '',
    website: '',
    about: '',
  })

  // Listing state
  const [editingListingId, setEditingListingId] = useState<string | null>(null)
  const [isAddingNewListing, setIsAddingNewListing] = useState(false)
  const [listingFormData, setListingFormData] = useState<ListingFormData>(EMPTY_LISTING_FORM)
  const [isSavingListing, setIsSavingListing] = useState(false)
  const [collapsedListingCards, setCollapsedListingCards] = useState<Set<string>>(new Set())
  const [listingCountryInput, setListingCountryInput] = useState('')
  const [isManagePhotosOpen, setIsManagePhotosOpen] = useState(false)

  // Delete confirmation
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<DeleteConfirmModalState>({
    isOpen: false,
    listingId: null,
    listingName: '',
  })

  // Image state
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const [showPictureModal, setShowPictureModal] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const listingImageInputRefs = useRef<HTMLInputElement[]>([])

  // Transform API response
  const transformHotelProfile = useCallback((apiProfile: ApiHotelProfile): ProfileHotelProfile => {
    const listings: ProfileHotelListing[] = (apiProfile.listings || []).map((apiListing) => {
      const offerings = apiListing.collaboration_offerings || []
      const collaborationTypes = offerings.map(o => o.collaboration_type) as ('Free Stay' | 'Paid' | 'Discount')[]
      const availabilityMonths = Array.from(new Set(offerings.flatMap(o => o.availability_months || [])))
      const platforms = Array.from(new Set(offerings.flatMap(o => o.platforms || [])))

      const freeStayOffering = offerings.find(o => o.collaboration_type === 'Free Stay')
      const paidOffering = offerings.find(o => o.collaboration_type === 'Paid')
      const discountOffering = offerings.find(o => o.collaboration_type === 'Discount')

      const creatorReqs: CreatorRequirements | undefined = apiListing.creator_requirements

      return {
        id: apiListing.id,
        name: apiListing.name,
        location: apiListing.location,
        description: apiListing.description,
        images: apiListing.images || [],
        accommodationType: apiListing.accommodation_type || undefined,
        collaborationTypes,
        availability: availabilityMonths,
        platforms,
        freeStayMinNights: freeStayOffering?.free_stay_min_nights ?? undefined,
        freeStayMaxNights: freeStayOffering?.free_stay_max_nights ?? undefined,
        paidMaxAmount: paidOffering?.paid_max_amount ?? undefined,
        discountPercentage: discountOffering?.discount_percentage ?? undefined,
        lookingForPlatforms: creatorReqs?.platforms || [],
        lookingForMinFollowers: creatorReqs?.min_followers ?? undefined,
        targetGroupCountries: creatorReqs?.target_countries || [],
        targetGroupAgeMin: creatorReqs?.target_age_min ?? undefined,
        targetGroupAgeMax: creatorReqs?.target_age_max ?? undefined,
        targetGroupAgeGroups: creatorReqs?.target_age_groups ?? [],
        status: apiListing.status as 'verified' | 'pending' | 'rejected',
      }
    })

    return {
      id: apiProfile.id,
      name: apiProfile.name,
      picture: apiProfile.picture || undefined,
      location: apiProfile.location,
      status: apiProfile.status as 'verified' | 'pending' | 'rejected',
      website: apiProfile.website || undefined,
      about: apiProfile.about || undefined,
      email: apiProfile.email,
      phone: apiProfile.phone || undefined,
      listings,
    }
  }, [])

  // Load profile
  const loadProfile = useCallback(async () => {
    try {
      const apiProfile = await hotelService.getMyProfile()
      const profile = transformHotelProfile(apiProfile)
      setHotelProfile(profile)
      setEmail(profile.email)
      setPhone(profile.phone || '')

      // Initialize edit form
      setEditFormData({
        name: profile.name,
        picture: profile.picture || '',
        location: profile.location,
        website: profile.website || '',
        about: profile.about || '',
      })

      return profile
    } catch (error) {
      if (error instanceof ApiErrorResponse && error.status === 405) {
        console.warn('Profile endpoint not yet implemented')
      } else {
        console.error('Failed to fetch hotel profile:', error)
      }
      return null
    }
  }, [transformHotelProfile])

  // Validation
  const validateForm = useCallback((): string | null => {
    if (!editFormData.name.trim()) return 'Hotel name is required'
    if (!editFormData.location.trim()) return 'Location is required'
    if (editFormData.website && !editFormData.website.match(/^https?:\/\//)) {
      return 'Website must start with http:// or https://'
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
      const updateData: Partial<ApiHotelProfile> = {
        name: editFormData.name.trim(),
        location: editFormData.location.trim(),
        website: editFormData.website?.trim() || undefined,
        about: editFormData.about?.trim() || undefined,
      }

      if (profilePictureFile) {
        const formData = new FormData()
        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined) formData.append(key, String(value))
        })
        formData.append('picture', profilePictureFile)
        await hotelService.updateMyProfile(formData)
      } else {
        await hotelService.updateMyProfile(updateData as Parameters<typeof hotelService.updateMyProfile>[0])
      }

      await loadProfile()
      setProfilePictureFile(null)
      setProfilePicturePreview(null)
      setIsEditingProfile(false)

      return true
    } catch (error) {
      const detail = error instanceof ApiErrorResponse ? error.data.detail : null
      onError?.('Failed to Save Profile', typeof detail === 'string' ? detail : 'Failed to save profile')
      return false
    } finally {
      setIsSavingProfile(false)
    }
  }, [editFormData, profilePictureFile, validateForm, loadProfile, onError])

  // Cancel edit
  const cancelEdit = useCallback(() => {
    if (hotelProfile) {
      setEditFormData({
        name: hotelProfile.name,
        picture: hotelProfile.picture || '',
        location: hotelProfile.location,
        website: hotelProfile.website || '',
        about: hotelProfile.about || '',
      })
    }
    setIsEditingProfile(false)
    setProfilePictureFile(null)
    setProfilePicturePreview(null)
  }, [hotelProfile])

  // Save contact
  const saveContact = useCallback(async () => {
    if (!hotelProfile) return false

    setIsSavingContact(true)
    try {
      await hotelService.updateMyProfile({ phone: phone.trim() } as Parameters<typeof hotelService.updateMyProfile>[0])
      setHotelProfile(prev => prev ? { ...prev, phone: phone.trim() } : null)
      setIsEditingContact(false)
      return true
    } catch (error) {
      const detail = error instanceof ApiErrorResponse ? error.data.detail : null
      onError?.('Failed to Save Contact Information', typeof detail === 'string' ? detail : 'Failed to save contact information')
      return false
    } finally {
      setIsSavingContact(false)
    }
  }, [hotelProfile, phone, onError])

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
      setEditFormData(prev => ({ ...prev, picture: profilePicturePreview }))
    }
    setShowPictureModal(false)
  }, [profilePicturePreview])

  // Listing card collapse
  const toggleListingCard = useCallback((listingId: string) => {
    setCollapsedListingCards(prev => {
      const next = new Set(prev)
      if (next.has(listingId)) next.delete(listingId)
      else next.add(listingId)
      return next
    })
  }, [])

  // Start editing listing
  const startEditListing = useCallback((listing: ProfileHotelListing) => {
    setEditingListingId(listing.id)
    setListingFormData({
      name: listing.name,
      location: listing.location,
      description: listing.description,
      images: listing.images,
      accommodationType: listing.accommodationType || '',
      collaborationTypes: listing.collaborationTypes,
      availability: listing.availability,
      platforms: listing.platforms,
      freeStayMinNights: listing.freeStayMinNights,
      freeStayMaxNights: listing.freeStayMaxNights,
      paidMaxAmount: listing.paidMaxAmount,
      discountPercentage: listing.discountPercentage,
      lookingForPlatforms: listing.lookingForPlatforms,
      lookingForMinFollowers: listing.lookingForMinFollowers,
      targetGroupCountries: listing.targetGroupCountries,
      targetGroupAgeMin: listing.targetGroupAgeMin,
      targetGroupAgeMax: listing.targetGroupAgeMax,
      targetGroupAgeGroups: listing.targetGroupAgeGroups || [],
    })
    setIsAddingNewListing(false)
  }, [])

  // Start adding new listing
  const startAddListing = useCallback(() => {
    setIsAddingNewListing(true)
    setEditingListingId(null)
    setListingFormData(EMPTY_LISTING_FORM)
  }, [])

  // Cancel listing edit
  const cancelListingEdit = useCallback(() => {
    setEditingListingId(null)
    setIsAddingNewListing(false)
    setListingFormData(EMPTY_LISTING_FORM)
  }, [])

  // Save listing
  const saveListing = useCallback(async () => {
    // Basic validation
    if (!listingFormData.name.trim()) {
      onError?.('Validation Error', 'Listing name is required')
      return false
    }
    if (!listingFormData.location.trim()) {
      onError?.('Validation Error', 'Location is required')
      return false
    }
    if (listingFormData.images.length === 0) {
      onError?.('Validation Error', 'At least one image is required')
      return false
    }

    setIsSavingListing(true)
    try {
      // TODO: Implement actual API call for saving listing
      // This would involve transforming listingFormData to API format
      // and calling hotelService.createListing or updateListing

      await loadProfile()
      cancelListingEdit()
      return true
    } catch (error) {
      const detail = error instanceof ApiErrorResponse ? error.data.detail : null
      onError?.('Failed to Save Listing', typeof detail === 'string' ? detail : 'Failed to save listing')
      return false
    } finally {
      setIsSavingListing(false)
    }
  }, [listingFormData, loadProfile, cancelListingEdit, onError])

  // Delete listing
  const openDeleteConfirm = useCallback((listingId: string, listingName: string) => {
    setDeleteConfirmModal({ isOpen: true, listingId, listingName })
  }, [])

  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirmModal({ isOpen: false, listingId: null, listingName: '' })
  }, [])

  const confirmDeleteListing = useCallback(async () => {
    if (!deleteConfirmModal.listingId) return false

    try {
      await hotelService.deleteListing(deleteConfirmModal.listingId)
      await loadProfile()
      closeDeleteConfirm()
      return true
    } catch (error) {
      const detail = error instanceof ApiErrorResponse ? error.data.detail : null
      onError?.('Failed to Delete Listing', typeof detail === 'string' ? detail : 'Failed to delete listing')
      return false
    }
  }, [deleteConfirmModal.listingId, loadProfile, closeDeleteConfirm, onError])

  // Update listing form field
  const updateListingField = useCallback(<K extends keyof ListingFormData>(field: K, value: ListingFormData[K]) => {
    setListingFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  // Listing image handlers
  const handleListingImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const maxImages = 10
    if (listingFormData.images.length + files.length > maxImages) {
      onError?.('Too Many Images', `Maximum ${maxImages} images allowed`)
      return
    }

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return
      if (file.size > 5 * 1024 * 1024) return

      const reader = new FileReader()
      reader.onloadend = () => {
        setListingFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string],
        }))
      }
      reader.readAsDataURL(file)
    })
  }, [listingFormData.images.length, onError])

  const removeListingImage = useCallback((index: number) => {
    setListingFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }, [])

  // Country helpers for listings
  const getAvailableCountriesForListing = useCallback(() => {
    const existing = listingFormData.targetGroupCountries
    return COUNTRIES.filter(c => !existing.includes(c) && c.toLowerCase().includes(listingCountryInput.toLowerCase()))
  }, [listingFormData.targetGroupCountries, listingCountryInput])

  const addCountryToListing = useCallback((country: string) => {
    setListingFormData(prev => ({
      ...prev,
      targetGroupCountries: [...prev.targetGroupCountries, country],
    }))
    setListingCountryInput('')
  }, [])

  const removeCountryFromListing = useCallback((country: string) => {
    setListingFormData(prev => ({
      ...prev,
      targetGroupCountries: prev.targetGroupCountries.filter(c => c !== country),
    }))
  }, [])

  return {
    // Profile state
    hotelProfile,
    setHotelProfile,
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

    // Listing state
    editingListingId,
    isAddingNewListing,
    listingFormData,
    setListingFormData,
    isSavingListing,
    collapsedListingCards,
    toggleListingCard,
    startEditListing,
    startAddListing,
    cancelListingEdit,
    saveListing,
    updateListingField,

    // Delete confirmation
    deleteConfirmModal,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDeleteListing,

    // Image state
    profilePictureFile,
    profilePicturePreview,
    showPictureModal,
    setShowPictureModal,
    imageInputRef,
    handleImageChange,
    confirmPicture,

    // Listing images
    listingImageInputRefs,
    handleListingImageChange,
    removeListingImage,
    isManagePhotosOpen,
    setIsManagePhotosOpen,

    // Country helpers
    listingCountryInput,
    setListingCountryInput,
    getAvailableCountriesForListing,
    addCountryToListing,
    removeCountryFromListing,
  }
}
