
import Button from '../ui/Button'
import Card from '../ui/Card'

const weekdays = [
  { label: 'Mon', value: 'MONDAY' },
  { label: 'Tue', value: 'TUESDAY' },
  { label: 'Wed', value: 'WEDNESDAY' },
  { label: 'Thu', value: 'THURSDAY' },
  { label: 'Fri', value: 'FRIDAY' },
  { label: 'Sat', value: 'SATURDAY' },
  { label: 'Sun', value: 'SUNDAY' },
]

export default function HabitCard({
  habit,
  isCompleted = false,
  streak = null,
  onToggle,
  onDelete,
}) {
  const scheduledDays = habit.scheduledDays || []

  return (
    <Card className="transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${
            habit.color || 'bg-indigo-100'
          }`}
        >
          {habit.icon || '✨'}
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={`text-sm font-semibold ${
              isCompleted
                ? 'text-slate-400 line-through'
                : 'text-slate-800'
            }`}
          >
            {habit.name}
          </h3>

          <p className="mt-0.5 text-xs text-slate-500">
            {habit.category || 'General'}
          </p>

          {habit.description && (
            <p className="mt-1 text-xs text-slate-600">
              {habit.description}
            </p>
          )}

          {habit.time && (
            <p className="mt-1 text-xs text-slate-400">
              ⏰ {habit.time}
            </p>
          )}

          <div className="mt-2">
            <p className="mb-1.5 text-xs font-medium text-slate-500">
              Weekly schedule
            </p>

            <div className="flex flex-wrap gap-1">
              {weekdays.map((day) => {
                const isScheduled = scheduledDays.includes(day.value)

                return (
                  <span
                    key={day.value}
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                      isScheduled
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {day.label}
                  </span>
                )
              })}
            </div>

            {scheduledDays.length === 0 && (
              <p className="mt-1 text-xs text-slate-400">
                No specific days selected
              </p>
            )}
          </div>

          {streak && (
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
              <span className="font-medium text-orange-600">
                🔥 {streak.currentStreak} day streak
              </span>

              <span className="text-slate-500">
                🏆 Best: {streak.longestStreak} days
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <Button
          variant={isCompleted ? 'secondary' : 'primary'}
          onClick={onToggle}
        >
          {isCompleted ? '✓ Completed' : 'Mark Complete'}
        </Button>

        <Button variant="outline" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </Card>
  )
}
