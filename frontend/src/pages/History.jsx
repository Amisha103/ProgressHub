
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import { useSharedHabits } from '../context/HabitsContext'

export default function History() {
  const { habits, completedIds, toggleHabit } = useSharedHabits()

  const completedHabits = habits.filter((habit) =>
    completedIds.includes(habit.id),
  )

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-bold text-slate-800">
          Your habit history
        </h2>
        <p className="mt-1 text-sm text-slate-500">{today}</p>
      </section>

      <Card>
        <p className="text-sm text-slate-500">Completed today</p>
        <p className="mt-2 text-3xl font-bold text-emerald-600">
          {completedHabits.length}
        </p>
      </Card>

      {completedHabits.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No completed habits yet"
          message="Mark a habit as complete on your Dashboard or My Habits page to see it here."
        />
      ) : (
        <div className="space-y-3">
          {completedHabits.map((habit) => (
            <Card
              key={habit.id}
              className="flex items-center gap-4"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
                  habit.color || 'bg-indigo-100'
                }`}
              >
                {habit.icon || '✨'}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-800">
                  {habit.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {habit.category || 'General'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleHabit(habit.id)}
                className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
              >
                ✓ Completed · Undo
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
