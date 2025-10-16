import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'

export default function RecentActivity({ items = [] }) {
  const [hoveredItem, setHoveredItem] = useState(null)
  
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'active':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      case 'investigating':
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }
  
  const getPriorityLabel = (priority) => {
    if (!priority) return 'Medium'
    
    const labelMap = {
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low'
    }
    
    return labelMap[priority.toLowerCase()] || priority
  }
  
  const getPriorityColor = (priority) => {
    if (!priority) return 'blue'
    
    const colorMap = {
      'high': 'red',
      'medium': 'yellow',
      'low': 'blue'
    }
    
    return colorMap[priority.toLowerCase()] || 'blue'
  }
  
  const getStatusColor = (status) => {
    if (!status) return 'green'
    
    const colorMap = {
      'resolved': 'green',
      'active': 'red',
      'closed': 'gray',
      'investigating': 'blue'
    }
    
    return colorMap[status.toLowerCase()] || 'green'
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`rounded-lg border p-4 transition-all duration-300 ${hoveredItem === index ? 'border-blue-300 shadow-md bg-blue-50/50' : 'border-gray-100 bg-white'} hover:shadow-sm`}
          onMouseEnter={() => setHoveredItem(index)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Badge color={getPriorityColor(item.priority)} className="capitalize font-medium">
                {getPriorityLabel(item.priority)}
              </Badge>
              <Badge color={getStatusColor(item.status)} className="capitalize font-medium">
                {getStatusIcon(item.status)} {item.status}
              </Badge>
            </div>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={14} />
              {formatDistanceToNow(new Date(item.when))} ago
            </span>
          </div>
          <div className="text-base font-semibold mb-2 transition-colors duration-300 hover:text-blue-700">
            {item.title}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 flex-shrink-0 text-gray-400" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Info className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No recent incidents</h3>
          <p className="text-sm text-gray-500 max-w-md">
            There are currently no recent incidents to display. When new incidents are reported, they will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
