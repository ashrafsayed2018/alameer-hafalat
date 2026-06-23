'use client'

import dynamic from 'next/dynamic'

const FloatingContact = dynamic(() => import('./FloatingContact'), { ssr: false })

export default function FloatingContactWrapper() {
  return <FloatingContact />
}
