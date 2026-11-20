
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

  const [draggedStep, setDraggedStep] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)

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
      await steppieService.updateStep(roadmap.id, editingStep, {
        ...editForm,
        weekNumber: Number(editForm.weekNumber),
        stepOrder: Number(editForm.stepOrder),
        estimatedMinutes: Number(editForm.estimatedMinutes),
      })

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

  // Start dragging a step.
  function handleDragStart(event, step) {
    if (saving || editingStep !== null) {
      event.preventDefault()
      return
    }

    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(step.id))

    setDraggedStep(step)
    setDropTarget(null)
  }

  function handleDragEnd() {
    setDraggedStep(null)
    setDropTarget(null)
  }

  // Determine whether the user is dropping above or below a step.
  function handleStepDragOver(event, step) {
    if (!draggedStep || draggedStep.id === step.id || saving) return

    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'

    const bounds = event.currentTarget.getBoundingClientRect()
    const middle = bounds.top + bounds.height / 2
    const placement = event.clientY < middle ? 'before' : 'after'

    setDropTarget({
      stepId: step.id,
      weekNumber: Number(step.weekNumber),
      placement,
    })
  }

  // Save the new position of a dragged step.
  async function saveDraggedStep(targetWeek, targetOrder) {
    if (!draggedStep || saving) return

    const step = draggedStep

    if (
      Number(step.weekNumber) === Number(targetWeek) &&
      Number(step.stepOrder) === Number(targetOrder)
    ) {
      handleDragEnd()
      return
    }

    setSaving(true)
    setError('')
    handleDragEnd()

    try {
      await steppieService.updateStep(roadmap.id, step.id, {
        weekNumber: Number(targetWeek),
        stepOrder: Number(targetOrder),
        title: step.title,
        description: step.description,
        estimatedMinutes: step.estimatedMinutes ?? 30,
      })

      await refreshRoadmap()
    } catch (err) {
      setError(err.message || 'Unable to reorder this step.')
      await refreshRoadmap()
    } finally {
      setSaving(false)
    }
  }

  // Drop a step before or after another step.
  async function handleDropOnStep(event, targetStep, placement) {
    event.preventDefault()
    event.stopPropagation()

    if (!draggedStep || draggedStep.id === targetStep.id) {
      handleDragEnd()
      return
    }

    const targetWeek = Number(targetStep.weekNumber)

    const targetWeekSteps = (roadmap?.steps || [])
      .filter(
        (step) =>
          Number(step.weekNumber) === targetWeek &&
          step.id !== draggedStep.id
      )
      .sort((a, b) => a.stepOrder - b.stepOrder)

    const targetIndex = targetWeekSteps.findIndex(
      (step) => step.id === targetStep.id
    )

    if (targetIndex === -1) {
      handleDragEnd()
      return
    }

    const insertIndex =
      targetIndex + (placement === 'after' ? 1 : 0)

    await saveDraggedStep(targetWeek, insertIndex + 1)
  }

  // Drop a step at the end of a week.
  async function handleDropAtWeekEnd(event, weekNumber) {
    event.preventDefault()
    event.stopPropagation()

    if (!draggedStep) return

    const targetWeekSteps = (roadmap?.steps || [])
      .filter(
        (step) =>
          Number(step.weekNumber) === Number(weekNumber) &&
          step.id !== draggedStep.id
      )
      .sort((a, b) => a.stepOrder - b.stepOrder)

    await saveDraggedStep(
      Number(weekNumber),
      targetWeekSteps.length + 1
    )
  }

  const groupedSteps = (roadmap?.steps || []).reduce((groups, step) => {
    const week = step.weekNumber ?? 1

    if (!groups[week]) groups[week] = []

    groups[week].push(step)
    return groups
  }, {})

  const weeks = Object.entries(groupedSteps).sort(
    ([a], [b]) => Number(a) - Number(b)
  )

  const lastWeek = Math.max(
    1,
    ...weeks.map(([week]) => Number(week))
  )

  const cardHover =
    'rounded-xl border border-transparent bg-slate-50 p-5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-lg'

  const actionHover =
    'transition-all duration-200 ease-in-out hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed'

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* Steppie introduction */}
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
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
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
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
            className="w-full resize-y rounded-xl border border-slate-200 p-4 text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              {goal.length}/1000 characters
            </p>

            <button
              type="submit"
              disabled={loading || !goal.trim()}
              className={`${actionHover} rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50`}
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

            <p className="mt-2 text-xs text-slate-400">
              💡 Drag the ⠿ handle on any step and drop it wherever you want.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setAddingWeek(lastWeek + 1)
              setEditingStep(null)
              setError('')
            }}
            className={`${actionHover} rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-md`}
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
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md"
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
                        className={`${actionHover} rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 hover:shadow-sm`}
                      >
                        + Add step
                      </button>
                    </div>

                    <div className="space-y-4">
                      {steps.map((step) => {
                        const isDropBefore =
                          dropTarget?.stepId === step.id &&
                          dropTarget?.placement === 'before'

                        const isDropAfter =
                          dropTarget?.stepId === step.id &&
                          dropTarget?.placement === 'after'

                        return (
                          <article
                            key={step.id}
                            onDragOver={(event) =>
                              handleStepDragOver(event, step)
                            }
                            onDrop={(event) =>
                              handleDropOnStep(
                                event,
                                step,
                                dropTarget?.placement || 'before'
                              )
                            }
                            className={`${cardHover} ${
                              draggedStep?.id === step.id
                                ? 'scale-[0.98] opacity-40'
                                : ''
                            } ${
                              isDropBefore
                                ? 'border-t-4 border-t-indigo-500'
                                : ''
                            } ${
                              isDropAfter
                                ? 'border-b-4 border-b-indigo-500'
                                : ''
                            }`}
                          >
                            {editingStep === step.id ? (
                              <form onSubmit={handleUpdateStep} className="space-y-4">
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
                                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                                    className={`${actionHover} rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 hover:shadow-md disabled:opacity-50`}
                                  >
                                    {saving ? 'Saving...' : 'Save changes'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setEditingStep(null)}
                                    className={`${actionHover} rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100`}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <>
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div className="flex items-start gap-3">
                                    <span
                                      draggable={!saving && editingStep === null}
                                      onDragStart={(event) =>
                                        handleDragStart(event, step)
                                      }
                                      onDragEnd={handleDragEnd}
                                      title="Drag to reorder this step"
                                      className="mt-0.5 cursor-grab select-none rounded-lg bg-white px-2 py-1 text-lg text-slate-400 shadow-sm transition-colors hover:bg-indigo-100 hover:text-indigo-700 active:cursor-grabbing"
                                    >
                                      ⠿
                                    </span>

                                    <h4 className="pt-1 font-semibold text-slate-900">
                                      {step.title}
                                    </h4>
                                  </div>

                                  {step.estimatedMinutes != null && (
                                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition-colors duration-200 hover:bg-indigo-100">
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
                                    disabled={saving}
                                    onClick={() => startEditing(step)}
                                    className={`${actionHover} rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-200 hover:shadow-sm disabled:opacity-50`}
                                  >
                                    ✎ Edit
                                  </button>

                                  <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => handleDeleteStep(step)}
                                    className={`${actionHover} rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-200 hover:shadow-sm disabled:opacity-50`}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </article>
                        )
                      })}
                    </div>

                    {/* Drop zone at the end of this week */}
                    <div
                      onDragOver={(event) => {
                        if (!draggedStep) return
                        event.preventDefault()
                        event.dataTransfer.dropEffect = 'move'
                        setDropTarget({
                          weekNumber: Number(week),
                          placement: 'end',
                        })
                      }}
                      onDrop={(event) =>
                        handleDropAtWeekEnd(event, Number(week))
                      }
                      className={`mt-4 rounded-xl border-2 border-dashed p-3 text-center text-xs transition-all duration-200 ${
                        dropTarget?.weekNumber === Number(week) &&
                        dropTarget?.placement === 'end'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                    >
                      {draggedStep
                        ? '↓ Drop here to move to the end of this week'
                        : 'Drag a step here to place it at the end of this week'}
                    </div>

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
                            className={`${actionHover} rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50`}
                          >
                            {saving ? 'Adding...' : 'Add step'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setAddingWeek(null)}
                            className={`${actionHover} rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-100`}
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

          {addingWeek !== null && !groupedSteps[addingWeek] && (
            <form
              onSubmit={handleAddStep}
              className="space-y-3 rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
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
                  className={`${actionHover} rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50`}
                >
                  {saving ? 'Adding...' : 'Add step'}
                </button>

                <button
                  type="button"
                  onClick={() => setAddingWeek(null)}
                  className={`${actionHover} rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100`}
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
