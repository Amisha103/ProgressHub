import EmptyState from '../components/ui/EmptyState'

function History() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
      <EmptyState
        icon="📅"
        title="Your progress story"
        message="Your daily completion history will appear here when we connect the history API."
      />
    </section>
  )
}

export default History