
import { useState } from 'react';
import calendarService from '../services/calendarService';

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnectCalendar = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await calendarService.connect();

      // Redirect to Google's authorization page
      window.location.assign(data.authorizationUrl);

    } catch (err) {
      setError(err.message || 'Unable to connect Google Calendar.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account and connected services.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
            📅
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Google Calendar
            </h2>
            <p className="text-sm text-slate-500">
              Connect your Google Calendar to ProgressHub.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={handleConnectCalendar}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Connecting...' : 'Connect Google Calendar'}
          </button>

          <p className="mt-2 text-xs text-slate-400">
            Authorize ProgressHub to access your Google Calendar.
          </p>

          {error && (
            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
