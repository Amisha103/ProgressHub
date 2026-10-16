
import { useState } from 'react'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import HabitForm from '../components/habits/HabitForm'
import HabitList from '../components/habits/HabitList'
import useHabits from '../hooks/useHabits'

export default function MyHabits() {
  const {
    habits,
    completedIds,
    addHabit,
    deleteHabit,
    toggleHabit,
  } = useHabits()

  const [isModalOpen, setIsModalOpen] = useState(false)

  function handleAddHabit(habitData) {
    addHabit(habitData)
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Your daily routines
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            You have {habits.length} habit{habits.length === 1 ? '' : 's'}.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          + Add Habit
        </Button>
      </div>

      <HabitList
        habits={habits}
        completedIds={completedIds}
        onToggle={toggleHabit}
        onDelete={deleteHabit}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a new habit"
      >
        <HabitForm
          onSubmit={handleAddHabit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
