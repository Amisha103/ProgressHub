
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'

const navigation = [
  { label: 'Dashboard', path: '/', icon: '⌂' },
  { label: 'My Habits', path: '/habits', icon: '✓' },
  { label: 'Categories', path: '/categories', icon: '✦' },
  { label: 'History', path: '/history', icon: '◷' },
  { label: 'Analytics', path: '/analytics', icon: '▥' },
]

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')

  async function handleLogout() {
    if (loggingOut) return

    setLoggingOut(true)
    setError('')

    try {
      await authService.logout()
      onNavigate?.()
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to log out. Please try again.')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-100 bg-white px-5 py-6">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-xl text-white">
          ✦
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            ProgressHub
          </h1>
          <p className="text-xs text-slate-500">Small steps, big growth</p>
        </div>
      </div>

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </p>

      <nav className="space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <span className="flex h-6 w-6 items-center justify-center text-lg">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-indigo-50 p-4">
        <div className="mb-2 text-xl">🌱</div>
        <h2 className="text-sm font-semibold text-slate-800">
          Keep growing!
        </h2>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Consistency beats perfection. One day at a time.
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-xs text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex h-6 w-6 items-center justify-center text-lg">
          ↪
        </span>
        {loggingOut ? 'Signing out...' : 'Log out'}
      </button>
    </aside>
  )
}
