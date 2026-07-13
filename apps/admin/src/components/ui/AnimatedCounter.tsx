'use client'

import { useEffect, useState } from 'react'

export function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1000
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [end])

  return <>{count.toLocaleString()}{suffix}</>
}
