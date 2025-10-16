import React from 'react'
export function Skeleton({ className = '' }) {
  return <div className={`h-3 w-full animate-pulse rounded bg-gray-200 ${className}`} />
}
