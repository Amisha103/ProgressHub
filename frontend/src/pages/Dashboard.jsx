
import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import HabitList from '../components/habits/HabitList'
import { useSharedHabits } from '../context/HabitsContext'
import WeeklyAnalytics from '../components/dashboard/WeeklyAnalytics'
import calendarService from '../services/calendarService'
import steppieScheduledTaskService from '../services/steppieScheduledTaskService'

export default function Dashboard() {
  const {
    habits,
    completedIds,
    toggleHabit,
    deleteHabit,
    loading,
    error,
    loadHabits,
  } = useSharedHabits()

  const [calendarConnected, setCalendarConnected] = useState(false)
  const [calendarLoading, setCalendarLoading] = useState(true)

  const [steppieTasks, setSteppieTasks] = useState([])
  const [steppieLoading, setSteppieLoading] = useState(true)
  const [steppieError, setSteppieError] = useState('')

  const now = new Date()

  // Use the browser's local date to avoid UTC date shifts.
  const todayDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')

  useEffect(() => {
    const checkCalendarConnection = async () => {
      try {
        const data = await calendarService.getStatus()
        setCalendarConnected(data.connected)
      } catch (err) {
        console.error('Calendar status check failed:', err)
      } finally {
        setCalendarLoading(false)
      }
    }

    checkCalendarConnection()
  }, [])

  useEffect(() => {
    const loadSteppieTasks = async () => {
      try {
        setSteppieError('')
        const data = await steppieScheduledTaskService.getForDate(todayDate)
        setSteppieTasks(Array.isArray(data) ? data : [])
      } catch (err) {
        setSteppieError(err.message || 'Could not load your Steppie tasks.')
      } finally {
        setSteppieLoading(false)
      }
    }

    loadSteppieTasks()
  }, [todayDate])

  const handleSteppieStatusChange = async (task) => {
    const newStatus =
      task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'

    try {
      await steppieScheduledTaskService.updateStatus(task.id, newStatus)

      setSteppieTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === task.id
            ? { ...item, status: newStatus }
            : item
        )
      )
    } catch (err) {
      setSteppieError(err.message || 'Could not update the task.')
    }
  }

  const handleSteppieReschedule = async (taskId, newDate) => {
    if (!newDate) return

    const task = steppieTasks.find((item) => item.id === taskId)
    if (!task || task.scheduledDate === newDate) return

    try {
      await steppieScheduledTaskService.rescheduleTask(taskId, newDate)

      // The task has moved away from today's schedule.
      setSteppieTasks((currentTasks) =>
        currentTasks.filter((item) => item.id !== taskId)
      )
    } catch (err) {
      setSteppieError(err.message || 'Could not reschedule the task.')
    }
  }

  const today = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const todayWeekday = now
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toUpperCase()

  const todaysHabits = habits.filter((habit) =>
    habit.scheduledDays?.includes(todayWeekday)
  )

  const todaysCompletedHabits = todaysHabits.filter((habit) =>
    completedIds.includes(habit.id)
  ).length

  const completedSteppieTasks = steppieTasks.filter(
    (task) => task.status === 'COMPLETED'
  ).length

  const totalTasks = todaysHabits.length + steppieTasks.length
  const totalCompleted = todaysCompletedHabits + completedSteppieTasks

  const dailyProgress =
    totalTasks === 0
      ? 0
      : Math.round((totalCompleted / totalTasks) * 100)

  const steppieGroups = steppieTasks.reduce((groups, task) => {
    const groupName = task.roadmapGoal || 'Steppie Roadmap'

    if (!groups[groupName]) {
      groups[groupName] = []
    }

    groups[groupName].push(task)
    return groups
  }, {})

  const hour = now.getHours()

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
        ? 'Good afternoon'
        : 'Good evening'

  const pageLoading = loading || steppieLoading

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-slate-500">{today}</p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          {greeting}! 👋
        </h2>

        <p className="mt-2 text-slate-500">
          Every small step counts. Keep building your routine.
        </p>
      </section>

      {/* Google Calendar connection status */}
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Google Calendar
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {calendarLoading
                ? 'Checking connection...'
                : calendarConnected
                  ? 'Your Google Calendar is connected to ProgressHub.'
                  : 'Connect Google Calendar to link your account.'}
            </p>
          </div>

          {!calendarLoading && (
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                calendarConnected
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {calendarConnected ? '✓ Connected' : 'Not connected'}
            </span>
          )}
        </div>
      </Card>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={loadHabits}
            className="mt-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {steppieError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          <p>{steppieError}</p>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Today's tasks</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {pageLoading ? '—' : totalTasks}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Completed today</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {pageLoading ? '—' : totalCompleted}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Daily progress</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {pageLoading ? '—' : `${dailyProgress}%`}
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${pageLoading ? 0 : dailyProgress}%` }}
            />
          </div>
        </Card>
      </section>

      {/* Combined daily schedule */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Today's Schedule
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your regular habits and Steppie roadmap tasks, all in one place.
          </p>
        </div>

        {pageLoading ? (
          <p className="rounded-xl bg-white p-6 text-sm text-slate-500">
            Loading your daily schedule...
          </p>
        ) : totalTasks === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-lg font-semibold text-slate-800">
              Nothing scheduled for today
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Visit My Habits to schedule a habit, or add a Steppie roadmap to your daily schedule.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Regular habits */}
            {todaysHabits.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800">
                  Regular Habits
                </h3>

                <HabitList
                  habits={todaysHabits}
                  completedIds={completedIds}
                  onToggle={toggleHabit}
                  onDelete={deleteHabit}
                />
              </div>
            )}

            {/* Steppie tasks grouped by roadmap */}
            {Object.entries(steppieGroups).map(([goal, tasks]) => (
              <div key={goal} className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                    Steppie Roadmap
                  </p>
                  <h3 className="mt-1 font-semibold text-slate-800">
                    {goal}
                  </h3>
                </div>

                <div className="space-y-3">
                  {tasks.map((task) => {
                    const isCompleted = task.status === 'COMPLETED'

                    return (
                      <Card key={task.id}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => handleSteppieStatusChange(task)}
                              aria-label={
                                isCompleted
                                  ? 'Mark task as pending'
                                  : 'Mark task as completed'
                              }
                              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold ${
                                isCompleted
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-slate-300 bg-white text-transparent'
                              }`}
                            >
                              ✓
                            </button>

                            <div>
                              <p
                                className={`font-semibold ${
                                  isCompleted
                                    ? 'text-slate-400 line-through'
                                    : 'text-slate-900'
                                }`}
                              >
                                {task.title}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {task.description}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                                <span>Week {task.weekNumber}</span>
                                {task.estimatedMinutes && (
                                  <span>
                                    · {task.estimatedMinutes} minutes
                                  </span>
                                )}
                                <span>
                                  · {isCompleted ? 'Completed' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="sm:shrink-0">
                            <label className="mb-1 block text-xs text-slate-500">
                              Reschedule
                            </label>
                            <input
                              type="date"
                              value={task.scheduledDate}
                              onChange={(event) =>
                                handleSteppieReschedule(
                                  task.id,
                                  event.target.value
                                )
                              }
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 sm:w-auto"
                            />
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <WeeklyAnalytics />
    </div>
  )
}
