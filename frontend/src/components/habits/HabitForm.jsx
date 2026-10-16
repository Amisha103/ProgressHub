
import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import categoryService from '../../services/categoryService'

const initialForm = {
  name: '',
  categoryId: '',
  reminderTime: '',
  resetTime: '',
  icon: '✨',
  color: 'bg-indigo-100',
}

export default function HabitForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      try {
        setLoadingCategories(true)
        setCategoryError('')

        const data = await categoryService.getAll()

        if (!cancelled) {
          setCategories(data)

          if (data.length > 0) {
            setForm((current) => ({
              ...current,
              categoryId: current.categoryId || String(data[0].id),
            }))
          }
        }
      } catch (error) {
        if (!cancelled) {
          setCategoryError(error.message || 'Unable to load categories.')
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false)
        }
      }
    }

    loadCategories()

    return () => {
      cancelled = true
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim() || !form.categoryId || submitting) {
      return
    }

    try {
      setSubmitting(true)
      setCategoryError('')

      await onSubmit({
        name: form.name.trim(),
        categoryId: Number(form.categoryId),
        icon: form.icon.trim() || '✨',
        color: form.color.trim() || 'bg-indigo-100',
        reminderTime: form.reminderTime || null,
        resetTime: form.resetTime || null,
      })

      setForm({
        ...initialForm,
        categoryId: categories.length ? String(categories[0].id) : '',
      })
    } catch (error) {
      setCategoryError(error.message || 'Unable to save the habit.')
    } finally {
      setSubmitting(false)
    }
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
          placeholder="e.g. Drink water"
          maxLength={150}
          required
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Category *
        </label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          disabled={loadingCategories || categories.length === 0}
          required
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500 disabled:bg-slate-50"
        >
          <option value="">
            {loadingCategories ? 'Loading categories...' : 'Select a category'}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>
        {!loadingCategories && categories.length === 0 && !categoryError && (
          <p className="mt-1 text-xs text-slate-500">
            Create a category before adding a habit.
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Reminder time
        </label>
        <input
          type="time"
          name="reminderTime"
          value={form.reminderTime}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Reset time
        </label>
        <input
          type="time"
          name="resetTime"
          value={form.resetTime}
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
          maxLength={50}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Color
        </label>
        <select
          name="color"
          value={form.color}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
        >
          <option value="bg-indigo-100">Indigo</option>
          <option value="bg-sky-100">Sky blue</option>
          <option value="bg-violet-100">Violet</option>
          <option value="bg-emerald-100">Emerald</option>
          <option value="bg-amber-100">Amber</option>
          <option value="bg-rose-100">Rose</option>
        </select>
      </div>

      {categoryError && (
        <p role="alert" className="text-sm text-rose-600">
          {categoryError}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={
            submitting ||
            loadingCategories ||
            categories.length === 0
          }
        >
          {submitting ? 'Saving...' : 'Add Habit'}
        </Button>
      </div>
    </form>
  )
}
