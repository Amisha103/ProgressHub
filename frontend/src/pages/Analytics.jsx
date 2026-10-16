import EmptyState from '../components/ui/EmptyState'

function Analytics() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
      <EmptyState
        icon="📈"
        title="See how far you have come"
        message="Your weekly progress, monthly completion rate, and habit streaks will appear here."
      />
    </section>
  )
}

export default Analytics