'use client'

import { Button } from '@/components/ui'
import {
  CheckCircleIcon,
  EnvelopeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import type { ProfileCompletionScreenProps } from './types'

export function ProfileCompletionScreen({
  userType,
  onGoHome,
  onEditProfile,
}: ProfileCompletionScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircleIcon className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Congratulations, your profile is complete!
          </h1>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            Thank you for completing your vayada {userType === 'creator' ? 'creator' : 'hotel'} profile. We're excited to review your submission and connect you with {userType === 'creator' ? 'high-quality hotels' : 'talented creators'}.
          </p>

          {/* Email Confirmation Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
            <div className="flex items-start gap-3">
              <EnvelopeIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Check your email</p>
                <p className="text-sm text-blue-800 mb-2">
                  You should have received a confirmation email with details about your profile submission and next steps.
                </p>
                <p className="text-xs text-blue-700 mt-2 pt-2 border-t border-blue-200">
                  <strong>Email Verification:</strong> If your email is not yet verified, please check your inbox for a verification link. Click the link to verify your email address and activate your account. The link expires in 48 hours.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-left bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-primary-600" />
              <p className="font-semibold text-gray-900 text-sm">Profile Review Status</p>
            </div>
            <p className="text-sm text-gray-600">
              Your profile is now in review by the vayada team. This process ensures the quality and authenticity of our {userType === 'creator' ? 'creator' : 'hotel partner'} network.
            </p>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <ClockIcon className="w-5 h-5 text-primary-600 mt-0.5" />
              <p><span className="font-semibold">Review Timeframe:</span> Up to 24 hours</p>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <EnvelopeIcon className="w-5 h-5 text-primary-600 mt-0.5" />
              <p>You will receive an email notification once your profile has been accepted and {userType === 'creator' ? 'you can start connecting with hotels' : 'your listings are live for creator matching'}.</p>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircleIcon className="w-5 h-5 text-primary-600 mt-0.5" />
              <p><span className="font-semibold">Email Verification:</span> Make sure to verify your email address first. Your account must be verified before your profile can be fully activated.</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              variant="primary"
              className="w-full justify-center font-semibold"
              onClick={onGoHome}
            >
              Go to homepage <span className="ml-1">&rarr;</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center font-semibold"
              onClick={onEditProfile}
            >
              Edit Profile Details
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Questions? Contact us at{' '}
            <a href="mailto:support@vayada.com" className="text-primary-600 hover:underline">
              support@vayada.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
