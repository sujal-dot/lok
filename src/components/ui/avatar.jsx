import React from 'react'

// Avatar component for displaying user profile images
const Avatar = React.forwardRef(({ 
  className, 
  children, 
  alt = 'Avatar', 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`
        relative
        flex
        h-10
        w-10
        shrink-0
        overflow-hidden
        rounded-full
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
})

// AvatarImage component for displaying the actual image
const AvatarImage = React.forwardRef(({ 
  src, 
  alt = 'Avatar', 
  className, 
  ...props 
}, ref) => {
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={`object-cover w-full h-full ${className}`}
      {...props}
    />
  )
})

// AvatarFallback component for displaying initials or icons when no image is available
const AvatarFallback = React.forwardRef(({ 
  children, 
  className, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`
        flex
        h-full
        w-full
        items-center
        justify-center
        rounded-full
        bg-gray-100
        text-gray-500
        dark:bg-gray-800
        dark:text-gray-400
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
})

export { Avatar, AvatarImage, AvatarFallback }
export default Avatar