import Header from '@/components/layout/Header'
import RoomForm from '@/components/rooms/RoomForm'

export default function NewRoomPage() {
  return (
    <>
      <Header
        title="Add Room"
        description="Create a new room type"
      />

      <div className="p-8 max-w-4xl">
        <RoomForm />
      </div>
    </>
  )
}
