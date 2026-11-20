
const API_URL = import.meta.env.VITE_API_BASE_URL;

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('progresshub-token');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    throw new Error('Your session may have expired. Please log in again.');
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  // DELETE requests may return an empty response.
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    return null;
  }

  return response.json();
}

const steppieService = {
  generateRoadmap(goal) {
    return request('/steppie/roadmaps/generate', {
      method: 'POST',
      body: JSON.stringify({ goal }),
    });
  },

  getRoadmaps() {
    return request('/steppie/roadmaps');
  },

  updateStep(roadmapId, stepId, stepData) {
    return request(`/steppie/roadmaps/${roadmapId}/steps/${stepId}`, {
      method: 'PUT',
      body: JSON.stringify(stepData),
    });
  },

  createStep(roadmapId, stepData) {
    return request(`/steppie/roadmaps/${roadmapId}/steps`, {
      method: 'POST',
      body: JSON.stringify(stepData),
    });
  },

  deleteStep(roadmapId, stepId) {
    return request(`/steppie/roadmaps/${roadmapId}/steps/${stepId}`, {
      method: 'DELETE',
    });
  },
};

export default steppieService;
