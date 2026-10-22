
import HabitCard from './HabitCard'
import EmptyState from '../ui/EmptyState'

export default function HabitList({
  habits = [],
  completedIds = [],
  streaks = {},
  onToggle,
  onDelete,
}) {
  if (habits.length === 0) {
    return (
      <EmptyState
        icon="🌱"
        title="No habits yet"
        message="Add your first habit to start building a better routine."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          isCompleted={completedIds.includes(habit.id)}
          streak={streaks[habit.id]}
          onToggle={() => onToggle(habit.id)}
          onDelete={() => onDelete(habit.id)}
        />
      ))}
    </div>
  )
}
