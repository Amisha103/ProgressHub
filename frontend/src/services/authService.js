const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function saveAuthData(data) {
  if (!data?.token || !data?.id) {
    throw new Error('The server returned an invalid authentication response.');
  }

  localStorage.setItem('progresshub-token', data.token);
  localStorage.setItem(
    'progresshub-user',
    JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
    }),
  );

  return data;
}

async function postAuth(endpoint, payload) {
  const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.detail ||
      'Unable to complete your request. Please try again.',
    );
  }

  return data;
}

const authService = {
  async login(email, password, rememberMe = false) {
    const data = await postAuth('login', {
      email: email.trim(),
      password,
      rememberMe,
    });

    return saveAuthData(data);
  },

  async register(name, email, password, rememberMe = false) {
    const data = await postAuth('register', {
      name: name.trim(),
      email: email.trim(),
      password,
      rememberMe,
    });

    return saveAuthData(data);
  },

  async refresh() {
    try {
      const data = await postAuth('refresh');
      return saveAuthData(data);
    } catch (error) {
      localStorage.removeItem('progresshub-token');
      localStorage.removeItem('progresshub-user');
      throw error;
    }
  },

  async logout() {
    try {
      await postAuth('logout');
    } finally {
      localStorage.removeItem('progresshub-token');
      localStorage.removeItem('progresshub-user');
    }
  },

  getUser() {
    try {
      const user = localStorage.getItem('progresshub-user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return Boolean(localStorage.getItem('progresshub-token'));
  },

  getToken() {
    return localStorage.getItem('progresshub-token');
  },
};

export default authService;