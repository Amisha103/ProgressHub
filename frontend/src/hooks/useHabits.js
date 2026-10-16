
import { useCallback, useEffect, useState } from 'react'
import habitService from '../services/habitService'

function mapHabit(habit) {
  return {
    ...habit,
    category: habit.categoryName || 'General',
    time: habit.reminderTime || '',
  }
}

export default function useHabits() {
  const [habits, setHabits] = useState([])
  const [completedIds, setCompletedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadHabits = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await habitService.getAll()
      setHabits(data.map(mapHabit))
    } catch (err) {
      setError(err.message || 'Unable to load habits.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('progresshub-token')) {
      setError('Please log in to load your habits.')
      setLoading(false)
      return
    }

    loadHabits()
  }, [loadHabits])

  const addHabit = useCallback((habit) => {
    setHabits((current) => [
      ...current,
      mapHabit(habit),
    ])
  }, [])

  const deleteHabit = useCallback(async (id) => {
    await habitService.archive(id)

    setHabits((current) =>
      current.filter((habit) => habit.id !== id),
    )

    setCompletedIds((current) =>
      current.filter((completedId) => completedId !== id),
    )
  }, [])

  const toggleHabit = useCallback((id) => {
    setCompletedIds((current) =>
      current.includes(id)
        ? current.filter((completedId) => completedId !== id)
        : [...current, id],
    )
  }, [])

  const completedCount = habits.filter((habit) =>
    completedIds.includes(habit.id),
  ).length

  const progress = habits.length
    ? Math.round((completedCount / habits.length) * 100)
    : 0

  return {
    habits,
    completedIds,
    completedCount,
    progress,
    loading,
    error,
    loadHabits,
    addHabit,
    deleteHabit,
    toggleHabit,
  }
}
