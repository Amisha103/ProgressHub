
import { createContext, useContext } from 'react'
import useHabits from '../hooks/useHabits'

const HabitsContext = createContext(null)

export function HabitsProvider({ children }) {
  const habitsData = useHabits()

  return (
    <HabitsContext.Provider value={habitsData}>
      {children}
    </HabitsContext.Provider>
  )
}

export function useSharedHabits() {
  const context = useContext(HabitsContext)

  if (!context) {
    throw new Error(
      'useSharedHabits must be used inside HabitsProvider',
    )
  }

  return context
}
