import React, { useState, useEffect, useRef } from 'react'

// Tooltip component for displaying information on hover
const Tooltip = React.forwardRef(({ children, content, delay = 300, placement = 'top' }, ref) => {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipRef = useRef(null)
  const timeoutRef = useRef(null)

  // Position classes based on placement
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  // Show tooltip after delay
  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  // Hide tooltip immediately
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsVisible(false)
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Get tooltip arrow position
  const getArrowPosition = () => {
    switch (placement) {
      case 'top':
        return 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-180'
      case 'bottom':
        return 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      case 'left':
        return 'right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 -rotate-90'
      case 'right':
        return 'left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90'
      default:
        return 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-180'
    }
  }

  return (
    <div 
      ref={ref}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div className="absolute z-50">
          <div className={`
            ${positionClasses[placement]}
            bg-black/80 text-white text-xs rounded-md px-2 py-1.5 whitespace-nowrap
            shadow-lg transition-all duration-200 animate-fadeIn
          `}
          ref={tooltipRef}
          >
            {content}
            <div className={`
              absolute w-2 h-2 bg-black/80 transform rotate-45
              ${getArrowPosition()}
            `} />
          </div>
        </div>
      )}
    </div>
  )
})

// TooltipProvider to wrap the app for tooltip functionality
const TooltipProvider = ({ children }) => {
  // Add global tooltip styles
  useEffect(() => {
    // Create and inject global styles for tooltip animations
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.15s ease-out;
      }
    `
    document.head.appendChild(style)
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return <>{children}</>
}

// TooltipContent component to provide content for the tooltip
const TooltipContent = ({ children }) => {
  return <>{children}</>
}

// TooltipTrigger component to trigger the tooltip on hover
const TooltipTrigger = ({ children }) => {
  return <>{children}</>
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
export default Tooltip