import type { UserType, CreatorProfileStatus, HotelProfileStatus, PlatformFormData, ListingFormData, CreatorFormState, HotelFormState } from '@/lib/types'

export interface ProfileCompleteContextProps {
  userType: UserType | null
  loading: boolean
  submitting: boolean
  error: string
  setError: (error: string) => void
  profileStatus: CreatorProfileStatus | HotelProfileStatus | null
  profileCompleted: boolean
  currentStep: number
  setCurrentStep: (step: number) => void
}

export interface StepIndicatorProps {
  steps: string[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export interface FormNavigationButtonsProps {
  currentStep: number
  totalSteps: number
  submitting: boolean
  canProceed: boolean
  onPrevious: () => void
  onNext: () => void
  submitLabel?: string
}

export interface ProfileCompletionProgressProps {
  percentage: number
}

export interface ProfileCompletionScreenProps {
  userType: UserType
  onGoHome: () => void
  onEditProfile: () => void
}

export interface LoadingScreenProps {
  // No props needed for now
}

// Re-export types for convenience
export type {
  UserType,
  CreatorProfileStatus,
  HotelProfileStatus,
  PlatformFormData,
  ListingFormData,
  CreatorFormState,
  HotelFormState,
}
