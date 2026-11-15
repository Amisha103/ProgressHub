
import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import HabitList from '../components/habits/HabitList'
import { useSharedHabits } from '../context/HabitsContext'
import WeeklyAnalytics from '../components/dashboard/WeeklyAnalytics'
import calendarService from '../services/calendarService'

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

  const now = new Date()

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

  const todaysCompletedCount = todaysHabits.filter((habit) =>
    completedIds.includes(habit.id)
  ).length

  const dailyProgress =
    todaysHabits.length === 0
      ? 0
      : Math.round(
          (todaysCompletedCount / todaysHabits.length) * 100
        )

  const hour = now.getHours()

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
        ? 'Good afternoon'
        : 'Good evening'

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

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Today's habits</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? '—' : todaysHabits.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Completed today</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {loading ? '—' : todaysCompletedCount}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Daily progress</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {loading ? '—' : `${dailyProgress}%`}
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${loading ? 0 : dailyProgress}%` }}
            />
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Today's habits
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Here are the habits scheduled for today.
          </p>
        </div>

        {loading ? (
          <p className="rounded-xl bg-white p-6 text-sm text-slate-500">
            Loading your habits...
          </p>
        ) : todaysHabits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-lg font-semibold text-slate-800">
              No habits scheduled for today
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Enjoy the day, or visit My Habits to schedule a habit for this weekday.
            </p>
          </div>
        ) : (
          <HabitList
            habits={todaysHabits}
            completedIds={completedIds}
            onToggle={toggleHabit}
            onDelete={deleteHabit}
          />
        )}
      </section>

      <WeeklyAnalytics />
    </div>
  )
}
