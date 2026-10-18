
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'

import { HabitsProvider } from './context/HabitsContext'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import MyHabits from './pages/MyHabits'
import History from './pages/History'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import Register from './pages/Register'
import authService from './services/authService'

function SessionInitializer({ children }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true

    async function restoreSession() {
      try {
        // Refresh even if an access token exists, so returning users
        // receive a fresh access token and a rotated refresh cookie.
        await authService.refresh()
      } catch {
        // No valid refresh session: the user must sign in.
      } finally {
        if (active) {
          setReady(true)
        }
      }
    }

    restoreSession()

    return () => {
      active = false
    }
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">
          Restoring your session...
        </p>
      </div>
    )
  }

  return children
}

function ProtectedRoute() {
  const location = useLocation()

  if (!authService.isLoggedIn()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <HabitsProvider>
              <MainLayout />
            </HabitsProvider>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="habits" element={<MyHabits />} />
          <Route path="history" element={<History />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionInitializer>
        <AppRoutes />
      </SessionInitializer>
    </BrowserRouter>
  )
}
