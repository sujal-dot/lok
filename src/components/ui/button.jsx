import React from 'react'
const base = 'inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
const variants = {
  default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600',
  outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-300',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300'
}
export function Button({ children, variant = 'default', className = '', ...props }) {
  return (
    <button className={`${base} ${variants[variant]} px-3 py-2 ${className}`} {...props}>
      {children}
    </button>
  )
}
