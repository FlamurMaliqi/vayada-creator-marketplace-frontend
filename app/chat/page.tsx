'use client'

import React, { useState } from 'react'
import { AuthenticatedNavigation } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import {
    MagnifyingGlassIcon,
    CheckIcon,
    XMarkIcon,
    ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/react/24/outline'

// Social Media Icons
const InstagramIcon = ({ className = "w-3 h-3" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
)

const YouTubeIcon = ({ className = "w-3 h-3" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
)

const TikTokIcon = ({ className = "w-3 h-3" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
)

// Mock Data with Platforms
const PENDING_REQUESTS = [
    {
        id: 1,
        name: 'Sarah Johnson',
        time: '2 days ago',
        followers: '125.0K',
        followersPlatform: 'instagram',
        engagement: '4.2%',
        engagementPlatform: 'youtube',
        avatarColor: 'bg-pink-100 text-pink-600',
        initials: 'SJ'
    },
    {
        id: 2,
        name: 'Mike Chen',
        time: '1 week ago',
        followers: '89.0K',
        followersPlatform: 'instagram',
        engagement: '5.1%',
        engagementPlatform: 'tiktok',
        avatarColor: 'bg-blue-100 text-blue-600',
        initials: 'MC'
    },
    {
        id: 3,
        name: 'Emma Rodriguez',
        time: '3 days ago',
        followers: '45.2K',
        followersPlatform: 'instagram',
        engagement: '6.8%',
        engagementPlatform: 'instagram',
        avatarColor: 'bg-purple-100 text-purple-600',
        initials: 'ER'
    }
]

const ACTIVE_CHATS = [
    {
        id: 1,
        name: 'Sarah Mitchell',
        handle: '@sarahtravels',
        status: 'Staying',
        statusColor: 'bg-blue-100 text-blue-700',
        time: '2 minutes',
        message: 'That sounds great! I\'ll have the content rea...',
        unread: 2,
        avatarColor: 'bg-red-100 text-red-600',
        initials: 'SM'
    },
    {
        id: 2,
        name: 'Marcus Chen',
        handle: '@marcusexplores',
        status: 'Negotiating',
        statusColor: 'bg-gray-100 text-gray-700',
        time: 'about 1 hour',
        message: 'Can we discuss the deliverables for the col...',
        unread: 0,
        avatarColor: 'bg-green-100 text-green-600',
        initials: 'MC'
    }
]

// Helper to get icon
const PlatformIcon = ({ platform, className }: { platform?: string, className?: string }) => {
    if (platform === 'instagram') return <InstagramIcon className={className} />
    if (platform === 'youtube') return <YouTubeIcon className={className} />
    if (platform === 'tiktok') return <TikTokIcon className={className} />
    return null
}

function ChatPageContent() {
    const { isCollapsed } = useSidebar()
    const [activeTab, setActiveTab] = useState<'Active' | 'Archived'>('Active')

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <AuthenticatedNavigation />

            {/* Main Container - adjusting left padding based on sidebar state */}
            <div
                className={`flex-1 flex transition-all duration-300 pt-16 ${isCollapsed ? 'md:pl-16' : 'md:pl-56'}`}
                style={{ height: '100vh' }}
            >
                {/* Left Chat Sidebar */}
                <div className="w-80 md:w-96 border-r border-gray-200 flex flex-col h-full bg-white flex-shrink-0">

                    {/* Search Header */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* New Applications Section */}
                        <div className="border-b border-gray-100">
                            <div className="px-4 py-3 flex items-center justify-between bg-gray-50/50 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                    <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">New Applications</span>
                                </div>
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {PENDING_REQUESTS.length} pending
                                </span>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {PENDING_REQUESTS.map((request) => (
                                    <div key={request.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${request.avatarColor}`}>
                                                {request.initials}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline gap-2 mb-0.5">
                                                    <h4 className="text-sm font-semibold text-gray-900 leading-none">{request.name}</h4>
                                                    <span className="text-[10px] text-gray-400">{request.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium leading-none">
                                                    <span>{request.followers}</span>
                                                    <span>•</span>
                                                    <span>{request.engagement}</span>
                                                    <div className="flex items-center gap-1">
                                                        <PlatformIcon platform={request.followersPlatform} className="w-3 h-3 text-gray-400" />
                                                        <PlatformIcon platform={request.engagementPlatform} className="w-3 h-3 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <button className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm" title="Accept">
                                                    <CheckIcon className="w-5 h-5" />
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl transition-colors shadow-sm" title="Decline">
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center border-b border-gray-200 sticky top-0 bg-white z-10">
                            <button
                                onClick={() => setActiveTab('Active')}
                                className={`flex-1 py-3 text-sm font-medium text-center relative ${activeTab === 'Active' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                Active
                                {activeTab === 'Active' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('Archived')}
                                className={`flex-1 py-3 text-sm font-medium text-center relative ${activeTab === 'Archived' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                Archived
                                {activeTab === 'Archived' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                )}
                            </button>
                        </div>

                        {/* Chats List */}
                        <div className="divide-y divide-gray-50">
                            {activeTab === 'Active' && ACTIVE_CHATS.map((chat) => (
                                <div key={chat.id} className="p-4 hover:bg-blue-50/50 cursor-pointer transition-colors relative">
                                    <div className="flex gap-3">
                                        <div className="relative">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${chat.avatarColor}`}>
                                                {chat.initials}
                                            </div>
                                            {chat.unread > 0 && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                                    {chat.unread}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h4 className="text-sm font-semibold text-gray-900 truncate">{chat.name}</h4>
                                                <span className="text-[10px] text-gray-400 flex-shrink-0">{chat.time}</span>
                                            </div>

                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs text-gray-500 truncate">{chat.handle}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${chat.statusColor}`}>
                                                    {chat.status}
                                                </span>
                                            </div>

                                            <p className={`text-sm truncate ${chat.unread > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                                                {chat.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {activeTab === 'Archived' && (
                                <div className="p-8 text-center text-sm text-gray-500">
                                    No archived conversations.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Chat Area - Empty State */}
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">No conversation selected</h2>
                    <p className="text-sm text-gray-500 max-w-sm mb-6">
                        Select a conversation from the list to start chatting, or check your pending requests to begin new collaborations.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                        <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" />
                        View Pending Requests
                    </button>
                </div>
            </div>
        </main>
    )
}

export default function ChatPage() {
    return <ChatPageContent />
}
