
import { useLocation } from 'react-router-dom'

const pageInfo = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Here’s a little progress for a better you.',
  },
  '/habits': {
    title: 'My Habits',
    subtitle: 'Build routines that bring out your best.',
  },
  '/history': {
    title: 'Habit History',
    subtitle: 'Look back at the progress you have made.',
  },
  '/analytics': {
    title: 'Your Analytics',
    subtitle: 'Discover patterns and celebrate your growth.',
  },
}

export default function Header({ onMenuClick }) {
  const location = useLocation()
  const currentPage = pageInfo[location.pathname] ?? pageInfo['/']

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return (
    <header className="flex min-h-24 items-center justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          ☰
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
            {currentPage.title}
          </h1>
          <p className="mt-1 hidden text-sm text-slate-500 sm:block">
            {currentPage.subtitle}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-700">
            {today}
          </p>
          <p className="text-xs text-slate-400">Today</p>
        </div>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700"
          aria-label="User profile"
          title="Your profile"
        >
          U
        </div>
      </div>
    </header>
  )
}
