
const API_BASE_URL = 'http://localhost:8080/api'

async function getAll() {
  const token = localStorage.getItem('progresshub-token')

  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

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
