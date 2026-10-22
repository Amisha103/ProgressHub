
import { useState } from 'react'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import HabitForm from '../components/habits/HabitForm'
import HabitList from '../components/habits/HabitList'
import { useSharedHabits } from '../context/HabitsContext'
import habitService from '../services/habitService'

export default function MyHabits() {
const {
  habits,
  completedIds,
  streaks,
  addHabit,
  deleteHabit,
  toggleHabit,
  loading,
  error,
  loadHabits,
} = useSharedHabits()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [archiveError, setArchiveError] = useState('')

  async function handleAddHabit(habitData) {
    setFormError('')

    try {
      const createdHabit = await habitService.create(habitData)

      addHabit({
        ...createdHabit,
        category: createdHabit.categoryName || 'General',
        time: createdHabit.reminderTime || '',
      })

      setIsModalOpen(false)
    } catch (err) {
      setFormError(err.message || 'Could not create habit.')
      throw err
    }
  }

  async function handleDeleteHabit(id) {
    setArchiveError('')

    try {
      await deleteHabit(id)
    } catch (err) {
      setArchiveError(err.message || 'Could not archive habit.')
    }
  }

  function handleCloseModal() {
    setIsModalOpen(false)
    setFormError('')
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Your daily routines
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            You have {habits.length}{' '}
            {habits.length === 1 ? 'habit' : 'habits'}.
          </p>
        </div>

        <Button
          onClick={() => {
            setFormError('')
            setIsModalOpen(true)
          }}
        >
          + Add Habit
        </Button>
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

      {archiveError && (
        <p
          role="alert"
          className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
        >
          {archiveError}
        </p>
      )}

      {loading ? (
        <p className="rounded-xl bg-white p-6 text-sm text-slate-500">
          Loading your habits...
        </p>
      ) : (
        <HabitList
          habits={habits}
          completedIds={completedIds}
            streaks={streaks}
          onToggle={toggleHabit}
          onDelete={handleDeleteHabit}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create a new habit"
      >
        {formError && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
          >
            {formError}
          </p>
        )}

        <HabitForm
          onSubmit={handleAddHabit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  )
}
