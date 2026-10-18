
const API_BASE_URL = 'http://localhost:8080/api'

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

  const data = await response.json().catch(() => null)

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

async function getAll(hasRetried = false) {
  const token = localStorage.getItem('progresshub-token')

  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (response.status === 401 && !hasRetried) {
    const refreshed = await refreshAccessToken()

    if (refreshed) {
      return getAll(true)
    }

    window.location.replace('/login')
    throw new Error('Your session has expired. Please sign in again.')
  }

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Failed to load categories (${response.status})`)
  }

  return response.json()
}

const categoryService = {
  getAll,
}

export default categoryService
