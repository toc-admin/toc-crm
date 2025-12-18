import { createServerClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import RoomForm from '@/components/rooms/RoomForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getRoom(id: string) {
  const supabase = createServerClient()

  const { data: room, error } = await (supabase
    .from('rooms') as any)
    .select('*')
    .eq('id', id)
    .single()

  if (error || !room) {
    return null
  }

  return room
}

export default async function EditRoomPage({
  params,
}: {
  params: { id: string }
}) {
  const room = await getRoom(params.id)

  if (!room) {
    notFound()
    return
  }

  return (
    <>
      <Header
        title="Edit Room"
        description={`Update ${room.name}`}
      />

      <div className="p-8 max-w-4xl">
        <RoomForm
          initialData={room}
          roomId={room.id}
        />
      </div>
    </>
  )
}
