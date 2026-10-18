
const API_BASE_URL = 'http://localhost:8080/api'

function getToken() {
  return localStorage.getItem('progresshub-token')
}

async function refreshAccessToken() {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    localStorage.removeItem('progresshub-token')
    localStorage.removeItem('progresshub-user')
    return false
  }

  const data = await response.json()

  if (!data?.token || !data?.id) {
    localStorage.removeItem('progresshub-token')
    localStorage.removeItem('progresshub-user')
    return false
  }

  localStorage.setItem('progresshub-token', data.token)
  localStorage.setItem(
    'progresshub-user',
    JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
    }),
  )

  return true
}

async function apiRequest(endpoint, options = {}, hasRetried = false) {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 401 && !hasRetried) {
    const refreshed = await refreshAccessToken()

    if (refreshed) {
      return apiRequest(endpoint, options, true)
    }

    window.location.replace('/login')
    throw new Error('Your session has expired. Please sign in again.')
  }

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed (${response.status})`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

const habitService = {
  getAll() {
    return apiRequest('/habits')
  },

  create(habitData) {
    return apiRequest('/habits', {
      method: 'POST',
      body: JSON.stringify(habitData),
    })
  },

  update(id, habitData) {
    return apiRequest(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(habitData),
    })
  },

  archive(id) {
    return apiRequest(`/habits/${id}/archive`, {
      method: 'PATCH',
    })
  },

  getStreak(id) {
    return apiRequest(`/habits/${id}/streak`)
  },
}

export default habitService
