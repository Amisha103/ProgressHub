
import Button from '../ui/Button'
import Card from '../ui/Card'

export default function HabitCard({
  habit,
  isCompleted = false,
  onToggle,
  onDelete,
}) {
  return (
    <Card className="transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
            habit.color || 'bg-indigo-100'
          }`}
        >
          {habit.icon || '✨'}
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={`font-semibold ${
              isCompleted
                ? 'text-slate-400 line-through'
                : 'text-slate-800'
            }`}
          >
            {habit.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {habit.category || 'General'}
          </p>

          {habit.description && (
            <p className="mt-2 text-sm text-slate-600">
              {habit.description}
            </p>
          )}

          {habit.time && (
            <p className="mt-2 text-xs text-slate-400">
              ⏰ {habit.time}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-2">
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
