import React from 'react'
import { Button } from '@/components/ui/button'

export default function TestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-4xl font-bold mb-4">Test Page</h1>
      <p className="text-xl mb-6">If you can see this, routing is working correctly!</p>
      <Button variant="default" size="lg">
        Test Button
      </Button>
    </div>
  )
}