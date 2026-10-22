
import Card from '../components/ui/Card'
import HabitList from '../components/habits/HabitList'
import { useSharedHabits } from '../context/HabitsContext'
import WeeklyAnalytics from '../components/dashboard/WeeklyAnalytics'

export default function Dashboard() {
  const {
    habits,
    completedIds,
    toggleHabit,
    deleteHabit,
    completedCount,
    progress,
    loading,
    error,
    loadHabits,
  } = useSharedHabits()

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const hour = new Date().getHours()

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
          <p className="text-sm text-slate-500">Total habits</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? '—' : habits.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Completed today</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {loading ? '—' : completedCount}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Daily progress</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {loading ? '—' : `${progress}%`}
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${loading ? 0 : progress}%` }}
            />
          </div>
        </Card>
      </section>
      <WeeklyAnalytics /> 
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Your habits
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Check off each habit as you complete it.
          </p>
        </div>

        {loading ? (
          <p className="rounded-xl bg-white p-6 text-sm text-slate-500">
            Loading your habits...
          </p>
        ) : (
          <HabitList
            habits={habits}
            completedIds={completedIds}
            onToggle={toggleHabit}
            onDelete={deleteHabit}
          />
        )}
      </section>
    </div>
  )
}
