import { useState } from 'react'
import { Plus, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function Topbar() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const navigate = useNavigate()

  const handleNewIncident = () => {
    navigate('/report')
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate data refresh
    setTimeout(() => {
      // In a real app, you would fetch fresh data here
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div>
        <h1 className="text-lg font-semibold leading-tight">Command Dashboard</h1>
        <p className="text-sm text-gray-500">Real-time overview of law enforcement operations</p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          className="gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02]"
          onClick={handleNewIncident}
        >
          <Plus size={16} /> New Incident
        </Button>
        <Button 
          variant="secondary" 
          className="gap-2 transition-all duration-300 transform hover:scale-[1.02]"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RotateCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </header>
  )
}
