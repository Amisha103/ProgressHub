
import { useEffect, useState } from 'react'
import categoryService from '../services/categoryService'
import Button from '../components/ui/Button'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadCategories() {
    try {
      setLoading(true)
      setError('')
      const data = await categoryService.getAll()
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Unable to load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName || saving) return

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const created = await categoryService.create({
        name: trimmedName,
      })

      setCategories((current) => [...current, created])
      setName('')
      setSuccess('Category created successfully.')
    } catch (err) {
      setError(err.message || 'Unable to create category.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Categories
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Organize your habits into meaningful groups.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
      >
        <label
          htmlFor="category-name"
          className="block text-sm font-medium text-slate-700"
        >
          Category name
        </label>

        <input
          id="category-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Health, Fitness, Learning"
          maxLength={100}
          required
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={saving || !name.trim()}>
            {saving ? 'Creating...' : 'Add Category'}
          </Button>
        </div>
      </form>

      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="text-sm text-emerald-700">
          {success}
        </p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Your Categories
        </h2>

        {loading ? (
          <p className="text-sm text-slate-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-slate-500">
            No categories yet. Create your first category above.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center gap-3 py-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  ✦
                </span>
                <span className="font-medium text-slate-800">
                  {category.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
