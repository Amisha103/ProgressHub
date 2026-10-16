
import Card from '../components/ui/Card'
import { useSharedHabits } from '../context/HabitsContext'

export default function Analytics() {
  const { habits, completedIds, completedCount, progress } =
    useSharedHabits()

  const remainingCount = habits.length - completedCount

  const categories = habits.reduce((result, habit) => {
    const category = habit.category || 'General'
    result[category] = (result[category] || 0) + 1
    return result
  }, {})

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-bold text-slate-800">
          Your progress at a glance
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Understand your current habits and daily completion.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Total habits</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {habits.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Completed</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {completedCount}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Remaining</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {remainingCount}
          </p>
        </Card>
      </section>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-800">
              Today's completion
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {completedCount} of {habits.length} habits completed
            </p>
          </div>

          <p className="text-2xl font-bold text-indigo-600">
            {progress}%
          </p>
        </div>

        <div
          className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Today's habit completion"
        >
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-semibold text-slate-800">
          Habits by category
        </h3>

        {Object.keys(categories).length === 0 ? (
          <p className="text-sm text-slate-500">
            Add a habit to see your category breakdown.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(categories).map(([category, count]) => {
              const percentage = Math.round(
                (count / habits.length) * 100,
              )

              return (
                <div key={category}>
                  <div className="mb-1 flex justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-700">
                      {category}
                    </span>
                    <span className="text-slate-500">
                      {count} {count === 1 ? 'habit' : 'habits'}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
