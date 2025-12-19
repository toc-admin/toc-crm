import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import SettingsTabs from '@/components/settings/SettingsTabs'
import { redirect } from 'next/navigation'

async function getUserData() {
  const supabase = createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  return user
}

async function getCompanySettings() {
  const supabase = createServerClient()

  const { data } = await (supabase
    .from('company_settings') as any)
    .select('*')
    .limit(1)
    .single()

  return data
}

async function getUserPreferences(userId: string) {
  const supabase = createServerClient()

  const { data } = await (supabase
    .from('user_preferences') as any)
    .select('*')
    .eq('user_id', userId)
    .single()

  return data
}

export default async function SettingsPage() {
  const user = await getUserData()
  const companySettings = await getCompanySettings()
  const userPreferences = await getUserPreferences(user.id)

  return (
    <>
      <Header
        title="Settings"
        description="Manage your account and preferences"
      />
      <div className="p-8">
        <SettingsTabs
          user={user}
          companySettings={companySettings}
          userPreferences={userPreferences}
        />
      </div>
    </>
  )
}
