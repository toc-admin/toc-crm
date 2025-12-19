'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import ProfileSection from './ProfileSection'
import SecuritySection from './SecuritySection'
import PreferencesSection from './PreferencesSection'
import CompanySection from './CompanySection'

type TabType = 'profile' | 'security' | 'preferences' | 'company'

interface SettingsTabsProps {
  user: User
  companySettings: any
  userPreferences: any
}

export default function SettingsTabs({
  user,
  companySettings,
  userPreferences,
}: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile')

  const tabs: { id: TabType; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'company', label: 'Company' },
  ]

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-2xl p-2">
        <div className="flex flex-col sm:flex-row gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all duration-200
                ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-100'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'profile' && <ProfileSection user={user} />}
        {activeTab === 'security' && <SecuritySection />}
        {activeTab === 'preferences' && (
          <PreferencesSection
            userId={user.id}
            initialPreferences={userPreferences}
          />
        )}
        {activeTab === 'company' && (
          <CompanySection initialData={companySettings} />
        )}
      </div>
    </div>
  )
}
