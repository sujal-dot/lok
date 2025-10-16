const base = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';

export function Label({ htmlFor, children, className = '', ...props }) {
  return (
    <label 
      htmlFor={htmlFor}
      className={`${base} ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}