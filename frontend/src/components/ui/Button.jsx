
const variants = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
  secondary:
    'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus:ring-indigo-400',
  outline:
    'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-400',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
}

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
  onClick,
}) {
  const variantClasses = variants[variant] ?? variants.primary

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses} ${className}`}
    >
      {children}
    </button>
  )
}
