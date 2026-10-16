
export default function EmptyState({
  icon = '✨',
  title = 'Nothing here yet',
  message = 'Your progress will appear here as you get started.',
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {message}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
