
import { useState } from 'react'
import demoHabits from '../data/demoHabits'

export default function useHabits() {
  const [habits, setHabits] = useState(() =>
    demoHabits.map((habit) => ({ ...habit })),
  )

  const [completedIds, setCompletedIds] = useState([])

  function addHabit(habitData) {
    const newHabit = {
      ...habitData,
      id: Date.now(),
      completed: false,
    }

    setHabits((currentHabits) => [...currentHabits, newHabit])
  }

  function deleteHabit(id) {
    setHabits((currentHabits) =>
      currentHabits.filter((habit) => habit.id !== id),
    )

    setCompletedIds((currentIds) =>
      currentIds.filter((completedId) => completedId !== id),
    )
  }

  function toggleHabit(id) {
    setCompletedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((completedId) => completedId !== id)
        : [...currentIds, id],
    )
  }

  const completedCount = completedIds.filter((id) =>
    habits.some((habit) => habit.id === id),
  ).length

  const progress = habits.length
    ? Math.round((completedCount / habits.length) * 100)
    : 0

  return {
    habits,
    completedIds,
    completedCount,
    progress,
    addHabit,
    deleteHabit,
    toggleHabit,
  }
}
