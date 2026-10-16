
import { useState } from 'react'
import Button from '../ui/Button'

const initialForm = {
  name: '',
  category: 'Health',
  time: '',
  icon: '✨',
  color: 'bg-indigo-100',
  description: '',
}

export default function HabitForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) return

    onSubmit({
      ...form,
      name: form.name.trim(),
    })

    setForm(initialForm)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Habit name *
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Drink 8 glasses of water"
          required
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Category
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
        >
          <option>Health</option>
          <option>Fitness</option>
          <option>Personal Growth</option>
          <option>Productivity</option>
          <option>Mindfulness</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Reminder time (optional)
        </label>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Icon (emoji)
        </label>
        <input
          name="icon"
          value={form.icon}
          onChange={handleChange}
          maxLength={8}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Description (optional)
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Why is this habit important to you?"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Add Habit</Button>
      </div>
    </form>
  )
}
