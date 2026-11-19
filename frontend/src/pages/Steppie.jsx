
import { useState } from 'react'
import steppieService from '../services/steppieService'

export default function Steppie() {
  const [goal, setGoal] = useState('')
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate(e) {
    e.preventDefault()

    if (!goal.trim()) {
      setError('Please enter a goal first.')
      return
    }

    setLoading(true)
    setError('')
    setRoadmap(null)

    try {
      const result = await steppieService.generateRoadmap(goal.trim())
      setRoadmap(result)
    } catch (err) {
      setError(err.message || 'Unable to generate your roadmap.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
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
          <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </section>

      {roadmap && (
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

          {roadmap.steps?.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(
                roadmap.steps.reduce((groups, step) => {
                  const week = step.weekNumber ?? 1
                  if (!groups[week]) groups[week] = []
                  groups[week].push(step)
                  return groups
                }, {})
              ).sort(([a], [b]) => Number(a) - Number(b)).map(([week, steps]) => (
                <div key={week} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-indigo-700">
                    Week {week}
                  </h3>

                  <div className="space-y-4">
                    {steps
                      .sort((a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0))
                      .map((step) => (
                        <article
                          key={step.id ?? `${week}-${step.stepOrder}`}
                          className="rounded-xl bg-slate-50 p-5"
                        >
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
                        </article>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No steps were returned for this roadmap.
            </p>
          )}
        </section>
      )}
    </div>
  )
}
