
import { useEffect, useState } from 'react'
import dailyTaskService from '../../services/dailyTaskService'
import Card from '../ui/Card'

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getWeekDates() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const monday = new Date(today)
  const day = monday.getDay()
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1))

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)

    return {
      date: formatDate(date),
      label: date.toLocaleDateString('en-IN', {
        weekday: 'short',
      }),
    }
  })
}

export default function WeeklyAnalytics() {
  const [weeklyTasks, setWeeklyTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const weekDates = getWeekDates()

  useEffect(() => {
    let cancelled = false

    async function loadWeeklyTasks() {
      try {
        const tasks = await dailyTaskService.getHistoryRange(
          weekDates[0].date,
          weekDates[6].date,
        )

        if (!cancelled) setWeeklyTasks(tasks)
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load weekly analytics.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadWeeklyTasks()

    return () => {
      cancelled = true
    }
  }, [])

  const dailyStats = weekDates.map((day) => {
    const tasks = weeklyTasks.filter(
      (task) => task.taskDate === day.date,
    )

    const completed = tasks.filter(
      (task) => task.status === 'COMPLETED',
    ).length

    return {
      ...day,
      total: tasks.length,
      completed,
      percentage: tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0,
    }
  })

  const totalTasks = dailyStats.reduce(
    (sum, day) => sum + day.total, 0,
  )

  const completedTasks = dailyStats.reduce(
    (sum, day) => sum + day.completed, 0,
  )

  const weeklyProgress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0

  const maxCompleted = Math.max(
    1, ...dailyStats.map((day) => day.completed),
  )

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          Weekly analytics
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Track your habit completion throughout the week.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-slate-500">Weekly completion</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {loading ? '—' : `${weeklyProgress}%`}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${loading ? 0 : weeklyProgress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {loading
              ? 'Loading weekly data...'
              : `${completedTasks} of ${totalTasks} scheduled tasks completed`}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Tasks completed</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {loading ? '—' : completedTasks}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Across the current Monday–Sunday week
          </p>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-slate-800">
          Daily completions
        </h3>

        <div className="mt-6 grid grid-cols-7 gap-2">
          {dailyStats.map((day) => (
            <div
              key={day.date}
              className="flex min-w-0 flex-col items-center"
            >
              <span className="mb-2 text-xs font-medium text-slate-600">
                {loading ? '—' : day.completed}
              </span>

              <div className="flex h-32 w-full items-end justify-center rounded-lg bg-slate-50 px-1">
                <div
                  className="w-full max-w-8 rounded-t-md bg-indigo-500 transition-all"
                  style={{
                    height:
                      loading || day.completed === 0
                        ? '0%'
                        : `${Math.max(
                            8,
                            (day.completed / maxCompleted) * 100,
                          )}%`,
                  }}
                  title={`${day.label}: ${day.completed} completed`}
                />
              </div>

              <span className="mt-2 text-xs text-slate-500">
                {day.label}
              </span>
              <span className="mt-1 text-xs text-slate-400">
                {loading ? '—' : `${day.percentage}%`}
              </span>
            </div>
          ))}
        </div>

        {!loading && totalTasks === 0 && !error && (
          <p className="mt-4 text-center text-sm text-slate-500">
            No saved task history for this week yet. Complete your
            habits to start tracking progress.
          </p>
        )}
      </Card>
    </section>
  )
}
