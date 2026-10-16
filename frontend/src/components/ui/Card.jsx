
export default function Card({
  children,
  className = '',
  padding = 'p-5',
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white shadow-sm ${padding} ${className}`}
    >
      {children}
    </div>
  )
}
