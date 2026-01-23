'use client'

import { Button } from '@/components/ui'
import { CheckCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import type { FormNavigationButtonsProps } from './types'

export function FormNavigationButtons({
  currentStep,
  totalSteps,
  submitting,
  canProceed,
  onPrevious,
  onNext,
  submitLabel = 'Complete Profile',
}: FormNavigationButtonsProps) {
  const isLastStep = currentStep === totalSteps

  return (
    <div className="pt-6 border-t border-gray-200 flex items-center justify-between gap-4">
      {currentStep > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="px-6 py-3"
        >
          Previous
        </Button>
      )}
      <div className="flex-1" />
      <Button
        type="submit"
        variant="primary"
        className="px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
        disabled={submitting || (!isLastStep && !canProceed)}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </span>
        ) : isLastStep ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            {submitLabel}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Next
            <ChevronDownIcon className="w-5 h-5 rotate-[-90deg]" />
          </span>
        )}
      </Button>
    </div>
  )
}
