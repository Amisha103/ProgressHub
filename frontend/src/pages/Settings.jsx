
import { useEffect, useState } from 'react';
import calendarService from '../services/calendarService';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');

  // Check Google Calendar connection when Settings loads
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setLoading(true);
        const data = await calendarService.getStatus();
        setConnected(data.connected);
      } catch (err) {
        setError(err.message || 'Unable to check connection.');
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  // Connect Google Calendar
  const handleConnectCalendar = async () => {
    try {
      setConnecting(true);
      setError('');

      const data = await calendarService.connect();

      window.location.assign(data.authorizationUrl);
    } catch (err) {
      setError(err.message || 'Unable to connect Google Calendar.');
      setConnecting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="max-w-xl rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-2">
          Google Calendar
        </h2>

        {loading ? (
          <p className="text-gray-500">
            Checking connection status...
          </p>
        ) : connected ? (
          <div>
            <p className="text-green-600 font-medium mb-4">
              ✓ Google Calendar is connected!
            </p>

            <p className="text-sm text-gray-500">
              Your Google Calendar account is successfully linked
              with ProgressHub.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 mb-4">
              Google Calendar is not connected.
            </p>

            <button
              onClick={handleConnectCalendar}
              disabled={connecting}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {connecting
                ? 'Connecting...'
                : 'Connect Google Calendar'}
            </button>
          </div>
        )}

        {error && (
          <p className="text-red-500 mt-4 text-sm">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
