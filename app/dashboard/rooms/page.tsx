import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import RoomsGrid from '@/components/rooms/RoomsGrid'

export const dynamic = 'force-dynamic'

async function getRooms() {
  const supabase = createServerClient()

  const { data: rooms, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching rooms:', error)
    return []
  }

  return rooms || []
}

export default async function RoomsPage() {
  const rooms = await getRooms()

  return (
    <>
      <Header
        title="Rooms"
        description={`Manage room types (${rooms.length} rooms)`}
        action={
          <Link href="/dashboard/rooms/new" className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Link>
        }
      />

      <div className="p-8">
        <RoomsGrid rooms={rooms} />
      </div>
    </>
  )
}
