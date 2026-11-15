
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const calendarService = {
  async connect() {
    const token = localStorage.getItem('progresshub-token');

    const response = await fetch(`${API_BASE_URL}/calendar/connect`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || data.detail || 'Unable to connect Google Calendar.',
      );
    }

    if (!data.authorizationUrl) {
      throw new Error('Google authorization URL was not returned.');
    }

    return data;
  },
};

export default calendarService;
