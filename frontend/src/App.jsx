
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import { HabitsProvider } from './context/HabitsContext'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import MyHabits from './pages/MyHabits'
import History from './pages/History'
import Analytics from './pages/Analytics'

export default function App() {
  return (
    <BrowserRouter>
      <HabitsProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="habits" element={<MyHabits />} />
            <Route path="history" element={<History />} />
            <Route path="analytics" element={<Analytics />} />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Route>
        </Routes>
      </HabitsProvider>
    </BrowserRouter>
  )
}
