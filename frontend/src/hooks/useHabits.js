
import { useCallback, useEffect, useState } from 'react'
import habitService from '../services/habitService'
import dailyTaskService from '../services/dailyTaskService'

function mapHabit(habit) {
  return {
    ...habit,
    category: habit.categoryName || 'General',
    time: habit.reminderTime || '',
  }
}

export default function useHabits() {
  const [habits, setHabits] = useState([])
  const [dailyTasks, setDailyTasks] = useState([])
  const [completedIds, setCompletedIds] = useState([])
  const [streaks, setStreaks] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadHabits = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [habitData, taskData] = await Promise.all([
        habitService.getAll(),
        dailyTaskService.getToday(),
      ])

      setHabits(habitData.map(mapHabit))
      setDailyTasks(taskData)

      setCompletedIds(
        taskData
          .filter((task) => task.status === 'COMPLETED')
          .map((task) => task.habitId),
      )

      const streakEntries = await Promise.all(
        habitData.map(async (habit) => {
          try {
            const streak = await habitService.getStreak(habit.id)
            return [habit.id, streak]
          } catch {
            return [habit.id, null]
          }
        }),
      )

      setStreaks(Object.fromEntries(streakEntries))
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
    setHabits((current) => [...current, mapHabit(habit)])
  }, [])

  const deleteHabit = useCallback(async (id) => {
    await habitService.archive(id)

    setHabits((current) =>
      current.filter((habit) => habit.id !== id),
    )

    setCompletedIds((current) =>
      current.filter((completedId) => completedId !== id),
    )

    setDailyTasks((current) =>
      current.filter((task) => task.habitId !== id),
    )

    setStreaks((current) => {
      const updated = { ...current }
      delete updated[id]
      return updated
    })
  }, [])

  const toggleHabit = useCallback(async (id) => {
    setError('')

    try {
      let task = dailyTasks.find(
        (item) => item.habitId === id,
      )

      if (!task) {
        const refreshedTasks = await dailyTaskService.getToday()
        setDailyTasks(refreshedTasks)

        task = refreshedTasks.find(
          (item) => item.habitId === id,
        )
      }

      if (!task) {
        setError('This habit has no task scheduled for today.')
        return
      }

      const isCompleted = task.status === 'COMPLETED'
      const newStatus = isCompleted ? 'PENDING' : 'COMPLETED'

      const updatedTask = await dailyTaskService.updateStatus(
        task.id,
        newStatus,
      )

      setDailyTasks((current) => {
        const exists = current.some(
          (item) => item.id === updatedTask.id,
        )

        if (!exists) {
          return [...current, updatedTask]
        }

        return current.map((item) =>
          item.id === updatedTask.id ? updatedTask : item,
        )
      })

      setCompletedIds((current) =>
        updatedTask.status === 'COMPLETED'
          ? current.includes(id)
            ? current
            : [...current, id]
          : current.filter((completedId) => completedId !== id),
      )

      try {
        const streak = await habitService.getStreak(id)
        setStreaks((current) => ({
          ...current,
          [id]: streak,
        }))
      } catch {
        // Keep the existing streak display if refreshing fails.
      }
    } catch (err) {
      setError(err.message || 'Unable to update habit status.')
    }
  }, [dailyTasks])

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
    streaks,
    loading,
    error,
    loadHabits,
    addHabit,
    deleteHabit,
    toggleHabit,
  }
}
