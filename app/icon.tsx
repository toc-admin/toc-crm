import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Backrest */}
          <rect x="8" y="4" width="16" height="10" rx="2" fill="#1e293b" />

          {/* Seat */}
          <rect x="6" y="14" width="20" height="3" rx="1" fill="#1e293b" />

          {/* Left front leg */}
          <rect x="7" y="17" width="2" height="11" fill="#1e293b" />

          {/* Right front leg */}
          <rect x="23" y="17" width="2" height="11" fill="#1e293b" />

          {/* Left back leg (extends to backrest) */}
          <rect x="9" y="14" width="2" height="14" fill="#1e293b" />

          {/* Right back leg (extends to backrest) */}
          <rect x="21" y="14" width="2" height="14" fill="#1e293b" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
