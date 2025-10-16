const alertBase = 'relative flex w-full items-start gap-3 rounded-md border px-4 py-3 text-sm ring-offset-white';
const variants = {
  default: 'bg-blue-50 text-blue-800 border-blue-200',
  destructive: 'bg-red-50 text-red-800 border-red-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-slate-50 text-slate-800 border-slate-200'
};

export function Alert({ children, variant = 'default', className = '', ...props }) {
  return (
    <div className={`${alertBase} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Alert title component
const alertTitleBase = 'font-medium';

export function AlertTitle({ children, className = '', ...props }) {
  return (
    <h4 className={`${alertTitleBase} ${className}`} {...props}>
      {children}
    </h4>
  );
}

// Alert description component
const alertDescriptionBase = 'text-sm';

export function AlertDescription({ children, className = '', ...props }) {
  return (
    <p className={`${alertDescriptionBase} ${className}`} {...props}>
      {children}
    </p>
  );
}