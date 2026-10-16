
const API_BASE_URL = 'http://localhost:8080/api'

function getToken() {
  return localStorage.getItem('progresshub-token')
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

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
