// Card container component
const cardBase = 'rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm';

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`${cardBase} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Card header component
const cardHeaderBase = 'flex flex-col space-y-1.5 p-6';

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`${cardHeaderBase} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Card title component
const cardTitleBase = 'text-2xl font-bold tracking-tight';

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`${cardTitleBase} ${className}`} {...props}>
      {children}
    </h3>
  );
}

// Card description component
const cardDescriptionBase = 'text-sm text-gray-500';

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`${cardDescriptionBase} ${className}`} {...props}>
      {children}
    </p>
  );
}

// Card content component
const cardContentBase = 'p-6 pt-0';

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`${cardContentBase} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Card footer component (optional, for completeness)
const cardFooterBase = 'flex items-center p-6 pt-0';

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`${cardFooterBase} ${className}`} {...props}>
      {children}
    </div>
  );
}