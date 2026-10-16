
import { useState } from 'react'

const navItems = [
  { name: 'Dashboard', icon: '▦' },
  { name: 'My Habits', icon: '◷' },
  { name: 'History', icon: '▤' },
  { name: 'Analytics', icon: '▥' },
]

const initialHabits = [
  {
    id: 1,
    name: 'Drink Water',
    category: 'Health',
    time: '9:00 AM',
    icon: '💧',
    color: 'bg-sky-100',
  },
  {
    id: 2,
    name: 'Read for 30 minutes',
    category: 'Personal Growth',
    time: '7:00 PM',
    icon: '📚',
    color: 'bg-violet-100',
  },
  {
    id: 3,
    name: 'Morning Exercise',
    category: 'Fitness',
    time: '6:30 AM',
    icon: '🏃',
    color: 'bg-emerald-100',
  },
]

const pageDescriptions = {
  Dashboard: 'Your daily progress at a glance.',
  'My Habits': 'Build routines that fit your life.',
  History: 'Look back at the progress you have made.',
  Analytics: 'Understand your consistency over time.',
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [habits] = useState(initialHabits)
  const [completed, setCompleted] = useState([])

  const toggleHabit = (id) => {
    setCompleted((previous) =>
      previous.includes(id)
        ? previous.filter((habitId) => habitId !== id)
        : [...previous, id],
    )
  }

  const progress = habits.length
    ? Math.round((completed.length / habits.length) * 100)
    : 0

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const renderHabit = (habit) => {
    const isCompleted = completed.includes(habit.id)

    return (
      <div
        key={habit.id}
        className={`flex items-center gap-3 rounded-2xl border p-4 transition sm:gap-4 ${
          isCompleted
            ? 'border-emerald-200 bg-emerald-50'
            : 'border-slate-100 bg-white hover:border-indigo-100'
        }`}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${habit.color}`}
        >
          {habit.icon}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`font-semibold ${
              isCompleted
                ? 'text-emerald-800 line-through'
                : 'text-slate-800'
            }`}
          >
            {habit.name}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {habit.category} · {habit.time}
          </p>
        </div>

        <button
          onClick={() => toggleHabit(habit.id)}
          className={`shrink-0 rounded-xl px-3 py-2 text-sm font-semibold transition sm:px-4 ${
            isCompleted
              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isCompleted ? 'Done ✓' : 'Complete'}
        </button>
      </div>
    )
  }

  const renderDashboard = () => (
    <>
      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-indigo-600 p-6 text-white shadow-sm">
          <p className="text-sm text-indigo-100">Today's Progress</p>

          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-4xl font-bold">{progress}%</p>
            <p className="text-sm text-indigo-100">
              {completed.length} of {habits.length} completed
            </p>
          </div>

          <div
            className="mt-5 h-2 overflow-hidden rounded-full bg-indigo-400"
            role="progressbar"
            aria-label="Today's habit completion"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Habits to complete</p>
          <p className="mt-3 text-4xl font-bold">
            {habits.length - completed.length}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            One step at a time. You've got this!
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Completed today</p>
          <p className="mt-3 text-4xl font-bold">{completed.length}</p>
          <p className="mt-2 text-sm text-slate-500">
            Every little win counts.
          </p>
        </div>
      </section>
     {activePage === 'Dashboard' && (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">Today's Habits</h3>
            <p className="mt-1 text-sm text-slate-500">
              Check off each habit as you complete it.
            </p>
          </div>

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
            {completed.length}/{habits.length} done
          </span>
        </div>

        {habits.length > 0 ? (
          <div className="space-y-3">{habits.map(renderHabit)}</div>
        ) : (
          <EmptyState
            icon="🌱"
            title="Your journey starts here"
            message="Add your first habit to begin building a routine."
          />
        )}
      </section> )}
    </>
  )

  const renderMyHabits = () => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold">Your Habits</h3>
          <p className="mt-1 text-sm text-slate-500">
            Small routines, meaningful progress.
          </p>
        </div>

        <span className="rounded-full bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
          {habits.length} habits
        </span>
      </div>

      {habits.length > 0 ? (
        <div className="space-y-3">{habits.map(renderHabit)}</div>
      ) : (
        <EmptyState
          icon="🌱"
          title="Start with one small habit"
          message="Your habits will appear here."
        />
      )}

      <p className="mt-5 text-sm text-slate-400">
        Habit creation and editing will be connected next.
      </p>
    </section>
  )

  const renderPlaceholder = () => {
    const content = {
      History: {
        icon: '📅',
        title: 'Your progress story',
        message:
          'Your daily completion history will appear here once we connect your backend.',
      },
      Analytics: {
        icon: '📈',
        title: 'See how far you have come',
        message:
          'Your weekly progress, monthly completion rate, and habit streaks will appear here.',
      },
    }

    const item = content[activePage]

    return (
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
          {item.icon}
        </div>
        <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
        <p className="mx-auto mt-2 max-w-md leading-7 text-slate-500">
          {item.message}
        </p>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">
      <aside className="bg-slate-900 p-5 text-white md:min-h-screen md:w-64 md:shrink-0 md:p-6">
        <div className="mb-7 flex items-center gap-3 md:mb-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500 text-xl font-bold">
            P
          </div>
          <div>
            <h1 className="text-xl font-bold">ProgressHub</h1>
            <p className="text-xs text-slate-400">Build better every day</p>
          </div>
        </div>

        <p className="mb-3 hidden text-xs font-semibold uppercase tracking-widest text-slate-500 md:block">
          Workspace
        </p>

        <nav
          aria-label="Main navigation"
          className="flex gap-2 overflow-x-auto md:flex-col"
        >
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              aria-current={activePage === item.name ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                activePage === item.name
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span aria-hidden="true" className="text-lg">
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 hidden rounded-2xl border border-slate-700 bg-slate-800 p-4 md:block">
          <p className="font-semibold">Small steps matter.</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Consistency today creates a better tomorrow.
          </p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              Your personal growth space
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">
              {activePage === 'Dashboard' ? 'Welcome back!' : activePage}
            </h2>
            <p className="mt-2 text-slate-500">
              {pageDescriptions[activePage]}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm">
            {today}
          </div>
        </header>

        {activePage === 'Dashboard' && renderDashboard()}
        {activePage === 'My Habits' && renderMyHabits()}
        {(activePage === 'History' || activePage === 'Analytics') &&
          renderPlaceholder()}

        <footer className="mt-8 pb-4 text-center text-sm text-slate-400">
          ProgressHub · Progress over perfection.
        </footer>
      </main>
    </div>
  )
}

function EmptyState({ icon, title, message }) {
  return (
    <div className="rounded-xl bg-slate-50 px-5 py-10 text-center">
      <div className="text-3xl">{icon}</div>
      <h4 className="mt-3 font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
    </div>
  )
}

export default App
