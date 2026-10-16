
import { useMemo } from 'react'
import Card from '../components/ui/Card'
import HabitList from '../components/habits/HabitList'
import useHabits from '../hooks/useHabits'

export default function Dashboard() {
  const {
    habits,
    completedIds,
    toggleHabit,
    deleteHabit,
    completedCount,
    progress,
  } = useHabits()

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const greeting = useMemo(() => {
    const hour = new Date().getHours()

    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">{today}</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          {greeting}! 👋
        </h2>
        <p className="mt-2 text-slate-500">
          Every small step counts. Keep building your routine.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Total habits</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {habits.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Completed today</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {completedCount}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Daily progress</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {progress}%
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Your habits
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Check off each habit as you complete it.
          </p>
        </div>

        <HabitList
          habits={habits}
          completedIds={completedIds}
          onToggle={toggleHabit}
          onDelete={deleteHabit}
        />
      </section>
    </div>
  )
}
