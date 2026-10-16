
const API_BASE_URL = 'http://localhost:8080/api'

const authService = {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'Login failed. Please check your credentials.')
    }

    const data = await response.json()

    // Store the JWT token for authenticated API requests.
    localStorage.setItem('progresshub-token', data.token)

    // Store basic user information.
    localStorage.setItem(
      'progresshub-user',
      JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
      }),
    )

    return data
  },

  logout() {
    localStorage.removeItem('progresshub-token')
    localStorage.removeItem('progresshub-user')
  },

  getUser() {
    try {
      const user = localStorage.getItem('progresshub-user')
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  },

  isLoggedIn() {
    return Boolean(localStorage.getItem('progresshub-token'))
  },
}

export default authService

