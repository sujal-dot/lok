// Select component system for Guardian Shield

import { forwardRef } from 'react';

// Select component - the main wrapper
const Select = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div className={`relative ${className}`} ref={ref} {...props}>
      {children}
    </div>
  );
});

// SelectTrigger component - the visible input part
const SelectTrigger = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`
        w-full
        px-3
        py-2
        border
        border-gray-300
        rounded-md
        bg-white
        text-sm
        flex
        items-center
        justify-between
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-transparent
        transition-colors
        duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
});

// SelectContent component - the dropdown content
const SelectContent = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`
        absolute
        mt-1
        w-full
        overflow-hidden
        rounded-md
        border
        border-gray-200
        bg-white
        shadow-lg
        z-10
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

// SelectItem component - individual option in the dropdown
const SelectItem = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`
        px-3
        py-2
        text-sm
        cursor-pointer
        hover:bg-gray-100
        focus:bg-gray-100
        focus:outline-none
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

// SelectValue component - displays the selected value
const SelectValue = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <span ref={ref} className={`${className}`} {...props}>
      {children}
    </span>
  );
});

// Set display names for debugging
Select.displayName = 'Select';
SelectTrigger.displayName = 'SelectTrigger';
SelectContent.displayName = 'SelectContent';
SelectItem.displayName = 'SelectItem';
SelectValue.displayName = 'SelectValue';

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };