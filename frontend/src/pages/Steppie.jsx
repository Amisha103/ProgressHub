
import { useEffect, useState } from 'react'
import steppieService from '../services/steppieService'

export default function Steppie() {
  const [goal, setGoal] = useState('')
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingStep, setEditingStep] = useState(null)
  const [addingWeek, setAddingWeek] = useState(null)
  const [saving, setSaving] = useState(false)

  const [editForm, setEditForm] = useState({
    weekNumber: 1,
    stepOrder: 1,
    title: '',
    description: '',
    estimatedMinutes: 30,
  })

  const [newStep, setNewStep] = useState({
    title: '',
    description: '',
    estimatedMinutes: 30,
  })

  useEffect(() => {
    loadRoadmaps()
  }, [])

  async function loadRoadmaps() {
    try {
      const roadmaps = await steppieService.getRoadmaps()

      if (roadmaps?.length > 0) {
        setRoadmap((current) => {
          if (current) {
            return roadmaps.find((r) => r.id === current.id) || roadmaps[0]
          }
          return roadmaps[0]
        })
      }
    } catch (err) {
      setError(err.message || 'Unable to load your saved roadmaps.')
    } finally {
      setInitialLoading(false)
    }
  }

  async function refreshRoadmap() {
    const roadmaps = await steppieService.getRoadmaps()
    const updated = roadmaps.find((r) => r.id === roadmap?.id)

    if (updated) {
      setRoadmap(updated)
    }
  }

  async function handleGenerate(e) {
    e.preventDefault()

    if (!goal.trim()) {
      setError('Please enter a goal first.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await steppieService.generateRoadmap(goal.trim())
      setRoadmap(result)
      setGoal('')
      setEditingStep(null)
      setAddingWeek(null)
    } catch (err) {
      setError(err.message || 'Unable to generate your roadmap.')
    } finally {
      setLoading(false)
    }
  }

  function startEditing(step) {
    setEditingStep(step.id)

    setEditForm({
      weekNumber: step.weekNumber ?? 1,
      stepOrder: step.stepOrder ?? 1,
      title: step.title,
      description: step.description,
      estimatedMinutes: step.estimatedMinutes ?? 30,
    })

    setAddingWeek(null)
    setError('')
  }

  async function handleUpdateStep(e) {
    e.preventDefault()

    if (!editForm.title.trim() || !editForm.description.trim()) {
      setError('Please enter a title and description.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await steppieService.updateStep(
        roadmap.id,
        editingStep,
        {
          ...editForm,
          weekNumber: Number(editForm.weekNumber),
          stepOrder: Number(editForm.stepOrder),
          estimatedMinutes: Number(editForm.estimatedMinutes),
        }
      )

      setEditingStep(null)
      await refreshRoadmap()
    } catch (err) {
      setError(err.message || 'Unable to update this step.')
    } finally {
      setSaving(false)
    }
  }

  async function handleAddStep(e) {
    e.preventDefault()

    if (!newStep.title.trim() || !newStep.description.trim()) {
      setError('Please enter a title and description.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await steppieService.createStep(roadmap.id, {
        weekNumber: Number(addingWeek),
        title: newStep.title.trim(),
        description: newStep.description.trim(),
        estimatedMinutes: Number(newStep.estimatedMinutes),
      })

      setAddingWeek(null)
      setNewStep({
        title: '',
        description: '',
        estimatedMinutes: 30,
      })

      await refreshRoadmap()
    } catch (err) {
      setError(err.message || 'Unable to add this step.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteStep(step) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${step.title}"?`
    )

    if (!confirmed) return

    setSaving(true)
    setError('')

    try {
      await steppieService.deleteStep(roadmap.id, step.id)
      await refreshRoadmap()
    } catch (err) {
      setError(err.message || 'Unable to delete this step.')
    } finally {
      setSaving(false)
    }
  }

  async function moveStep(step, direction, weekSteps) {
    const currentIndex = weekSteps.findIndex(
      (item) => item.id === step.id
    )

    const newIndex = currentIndex + direction

    if (newIndex < 0 || newIndex >= weekSteps.length) return

    setSaving(true)
    setError('')

    try {
      await steppieService.updateStep(
        roadmap.id,
        step.id,
        {
          weekNumber: step.weekNumber,
          stepOrder: newIndex + 1,
          title: step.title,
          description: step.description,
          estimatedMinutes: step.estimatedMinutes ?? 30,
        }
      )

      await refreshRoadmap()
    } catch (err) {
      setError(err.message || 'Unable to reorder this step.')
    } finally {
      setSaving(false)
    }
  }

  const groupedSteps = (roadmap?.steps || []).reduce((groups, step) => {
    const week = step.weekNumber ?? 1

    if (!groups[week]) groups[week] = []

    groups[week].push(step)
    return groups
  }, {})

  const weeks = Object.entries(groupedSteps)
    .sort(([a], [b]) => Number(a) - Number(b))

  const lastWeek = Math.max(
    1,
    ...weeks.map(([week]) => Number(week))
  )

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* Steppie introduction */}
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-100">
          Meet your AI growth companion
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Hi, I'm Steppie! 🌱
        </h1>

        <p className="mt-3 max-w-2xl text-indigo-100">
          Big goals. Little steps. Tell me what you want to achieve,
          and I'll turn it into a practical, personalized roadmap.
        </p>
      </section>

      {/* Goal generator */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          What's your big goal?
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Don't worry about how to achieve it. We'll figure that out together.
        </p>

        <form onSubmit={handleGenerate} className="mt-5 space-y-4">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Example: I want to learn React and build a full-stack project in 30 days..."
            rows={4}
            maxLength={1000}
            disabled={loading}
            className="w-full resize-y rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              {goal.length}/1000 characters
            </p>

            <button
              type="submit"
              disabled={loading || !goal.trim()}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating your roadmap...' : '✦ Generate my roadmap'}
            </button>
          </div>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600"
          >
            {error}
          </p>
        )}
      </section>

      {/* Saved roadmap */}
      {initialLoading ? (
        <p className="py-6 text-center text-sm text-slate-500">
          Loading your saved roadmap...
        </p>
      ) : roadmap && (
        <section className="space-y-6">

          <div>
            <p className="text-sm font-semibold text-indigo-600">
              YOUR PERSONALIZED ROADMAP
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {roadmap.goal}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {roadmap.steps?.length || 0} steps to help you move forward.
            </p>
          </div>

          {/* Add another week */}
          <button
            type="button"
            onClick={() => {
              setAddingWeek(lastWeek + 1)
              setEditingStep(null)
              setError('')
            }}
            className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            + Add a new week
          </button>

          {weeks.length > 0 ? (
            <div className="space-y-6">
              {weeks.map(([week, originalSteps]) => {
                const steps = [...originalSteps].sort(
                  (a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0)
                )

                return (
                  <div
                    key={week}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-lg font-bold text-indigo-700">
                        Week {week}
                      </h3>

                      <button
                        type="button"
                        onClick={() => {
                          setAddingWeek(Number(week))
                          setEditingStep(null)
                          setError('')
                        }}
                        className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                      >
                        + Add step
                      </button>
                    </div>

                    <div className="space-y-4">
                      {steps.map((step, index) => (
                        <article
                          key={step.id}
                          className="rounded-xl bg-slate-50 p-5"
                        >
                          {editingStep === step.id ? (
                            <form
                              onSubmit={handleUpdateStep}
                              className="space-y-4"
                            >
                              <h4 className="font-semibold text-slate-900">
                                Edit step
                              </h4>

                              <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                  Title
                                </label>
                                <input
                                  required
                                  maxLength={300}
                                  value={editForm.title}
                                  onChange={(e) => setEditForm({
                                    ...editForm,
                                    title: e.target.value,
                                  })}
                                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-500"
                                />
                              </div>

                              <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                  Description
                                </label>
                                <textarea
                                  required
                                  maxLength={2000}
                                  rows={3}
                                  value={editForm.description}
                                  onChange={(e) => setEditForm({
                                    ...editForm,
                                    description: e.target.value,
                                  })}
                                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-500"
                                />
                              </div>

                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div>
                                  <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Week
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    required
                                    value={editForm.weekNumber}
                                    onChange={(e) => setEditForm({
                                      ...editForm,
                                      weekNumber: e.target.value,
                                    })}
                                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Position
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    required
                                    value={editForm.stepOrder}
                                    onChange={(e) => setEditForm({
                                      ...editForm,
                                      stepOrder: e.target.value,
                                    })}
                                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Minutes
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    required
                                    value={editForm.estimatedMinutes}
                                    onChange={(e) => setEditForm({
                                      ...editForm,
                                      estimatedMinutes: e.target.value,
                                    })}
                                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="submit"
                                  disabled={saving}
                                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                  {saving ? 'Saving...' : 'Save changes'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setEditingStep(null)}
                                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <h4 className="font-semibold text-slate-900">
                                  {step.title}
                                </h4>

                                {step.estimatedMinutes != null && (
                                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                                    ◷ {step.estimatedMinutes} min
                                  </span>
                                )}
                              </div>

                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {step.description}
                              </p>

                              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3">
                                <button
                                  type="button"
                                  disabled={saving || index === 0}
                                  onClick={() => moveStep(step, -1, steps)}
                                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                                  title="Move up"
                                >
                                  ↑ Move up
                                </button>

                                <button
                                  type="button"
                                  disabled={saving || index === steps.length - 1}
                                  onClick={() => moveStep(step, 1, steps)}
                                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                                  title="Move down"
                                >
                                  ↓ Move down
                                </button>

                                <button
                                  type="button"
                                  disabled={saving}
                                  onClick={() => startEditing(step)}
                                  className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                                >
                                  ✎ Edit
                                </button>

                                <button
                                  type="button"
                                  disabled={saving}
                                  onClick={() => handleDeleteStep(step)}
                                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </article>
                      ))}
                    </div>

                    {/* Add step form */}
                    {addingWeek === Number(week) && (
                      <form
                        onSubmit={handleAddStep}
                        className="mt-5 space-y-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5"
                      >
                        <h4 className="font-semibold text-indigo-900">
                          Add a step to Week {week}
                        </h4>

                        <input
                          required
                          maxLength={300}
                          placeholder="Step title"
                          value={newStep.title}
                          onChange={(e) => setNewStep({
                            ...newStep,
                            title: e.target.value,
                          })}
                          className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"
                        />

                        <textarea
                          required
                          maxLength={2000}
                          rows={3}
                          placeholder="Describe what you need to do..."
                          value={newStep.description}
                          onChange={(e) => setNewStep({
                            ...newStep,
                            description: e.target.value,
                          })}
                          className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"
                        />

                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Estimated minutes"
                          value={newStep.estimatedMinutes}
                          onChange={(e) => setNewStep({
                            ...newStep,
                            estimatedMinutes: e.target.value,
                          })}
                          className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm"
                        />

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {saving ? 'Adding...' : 'Add step'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setAddingWeek(null)}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="rounded-xl bg-white p-6 text-sm text-slate-500">
              No steps were returned for this roadmap.
            </p>
          )}

          {/* Add step to a new week */}
          {addingWeek !== null && !groupedSteps[addingWeek] && (
            <form
              onSubmit={handleAddStep}
              className="space-y-3 rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-bold text-indigo-700">
                Add a step to Week {addingWeek}
              </h3>

              <input
                required
                maxLength={300}
                placeholder="Step title"
                value={newStep.title}
                onChange={(e) => setNewStep({
                  ...newStep,
                  title: e.target.value,
                })}
                className="w-full rounded-lg border border-slate-200 p-3 text-sm"
              />

              <textarea
                required
                maxLength={2000}
                rows={3}
                placeholder="Describe what you need to do..."
                value={newStep.description}
                onChange={(e) => setNewStep({
                  ...newStep,
                  description: e.target.value,
                })}
                className="w-full rounded-lg border border-slate-200 p-3 text-sm"
              />

              <input
                type="number"
                min="1"
                required
                value={newStep.estimatedMinutes}
                onChange={(e) => setNewStep({
                  ...newStep,
                  estimatedMinutes: e.target.value,
                })}
                className="w-full rounded-lg border border-slate-200 p-3 text-sm"
                placeholder="Estimated minutes"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add step'}
                </button>

                <button
                  type="button"
                  onClick={() => setAddingWeek(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </section>
      )}
    </div>
  )
}
