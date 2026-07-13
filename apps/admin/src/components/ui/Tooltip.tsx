'use client'

import { ReactNode, useState } from 'react'

export function Tooltip({ children, content }: { children: ReactNode; content: string }) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-[8px] bg-[#2d1f14] dark:bg-[#e8d5c4] text-white dark:text-[#2d1f14] text-xs whitespace-nowrap z-50">
          {content}
        </div>
      )}
    </div>
  )
}
