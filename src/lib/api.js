const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export const ACCESS_TOKEN_KEY = 'naturalfoods_access_token';
export const REFRESH_TOKEN_KEY = 'naturalfoods_refresh_token';
export const ACTIVE_USER_KEY = 'naturalfoods_active_user';

function buildUrl(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAuthSession({ access, refresh, user }) {
  if (access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
  }
  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
  if (user) {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACTIVE_USER_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await fetch(buildUrl('/api/auth/refresh/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      if (res.status === 401) clearAuthSession();
      return null;
    }
    const data = await res.json();
    if (data.access) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
      return data.access;
    }
    clearAuthSession();
    return null;
  } catch {
    return null;
  }
}

export async function getValidAccessToken() {
  const token = getAccessToken();
  if (!token) return null;
  // SimpleJWT access tokens are JWTs with an 'exp' claim.
  // If expired (or about to expire in 30s), try refresh.
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    if (Date.now() >= exp - 30000) {
      const fresh = await refreshAccessToken();
      return fresh;
    }
  } catch {
    // can't parse token — just return it as-is
  }
  return token;
}

export async function apiRequest(path, options = {}) {
  const { token, headers = {}, body, ...rest } = options;
  const requestHeaders = { ...headers };

  const activeToken = token ? (await getValidAccessToken()) || token : null;
  if (activeToken) {
    requestHeaders.Authorization = `Bearer ${activeToken}`;
  }

  let requestBody = body;
  if (body && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path), {
    ...rest,
    headers: requestHeaders,
    body: requestBody,
  });

  let payload = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    payload = await response.json();
  } else {
    const text = await response.text();
    payload = text || null;
  }

  if (response.status === 401 && activeToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      requestHeaders.Authorization = `Bearer ${refreshed}`;
      const retryRes = await fetch(buildUrl(path), {
        ...rest,
        headers: requestHeaders,
        body: requestBody,
      });
      if (retryRes.ok) {
        const retryContentType = retryRes.headers.get('content-type') || '';
        if (retryContentType.includes('application/json')) return retryRes.json();
        const text = await retryRes.text();
        return text || null;
      }
    }
  }

  if (!response.ok) {
    const message =
      payload?.detail ||
      (typeof payload === 'string' && payload) ||
      Object.values(payload || {}).flat?.()[0] ||
      'Request failed';
    const error = new Error(message);
    error.response = response;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export async function registerUser(data) {
  return apiRequest('/api/auth/register/', {
    method: 'POST',
    body: data,
  });
}

export async function loginUser({ username, password }) {
  return apiRequest('/api/auth/login/', {
    method: 'POST',
    body: { username, password },
  });
}

export async function fetchProducts(token) {
  try {
    return await apiRequest('/api/dashboard/storefront/products/', { method: 'GET', token });
  } catch {
    return [];
  }
}

export async function fetchStorefrontSummary(token) {
  return apiRequest('/api/dashboard/storefront/summary/', {
    method: 'GET',
    token,
  });
}

export async function placeStorefrontOrder(token, body) {
  return apiRequest('/api/dashboard/storefront/orders/place/', {
    method: 'POST',
    token,
    body,
  });
}

export async function cancelStorefrontOrder(token, body) {
  return apiRequest('/api/dashboard/storefront/orders/cancel/', {
    method: 'POST',
    token,
    body,
  });
}

export async function updateProduct(token, productId, formData) {
  return apiRequest(`/api/dashboard/products/${productId}/`, {
    method: 'PATCH',
    token,
    body: formData,
  });
}

export async function createProduct(token, formData) {
  return apiRequest('/api/dashboard/products/', {
    method: 'POST',
    token,
    body: formData,
  });
}

export async function deleteProduct(token, productId) {
  return apiRequest(`/api/dashboard/products/${productId}/`, {
    method: 'DELETE',
    token,
  });
}

export async function fetchDashboardStats(token) {
  return apiRequest('/api/dashboard/stats/', {
    method: 'GET',
    token,
  });
}

export async function sendMessage(token, body) {
  return apiRequest('/api/messages/compose/', {
    method: 'POST',
    token,
    body,
  });
}

export async function fetchMyConversations(token) {
  return apiRequest('/api/messages/my-conversations/', {
    method: 'GET',
    token,
  });
}

export async function fetchAdminConversations(token) {
  return apiRequest('/api/messages/conversations/', {
    method: 'GET',
    token,
  });
}

export async function adminReplyToMessage(token, messageId, body) {
  return apiRequest(`/api/messages/${messageId}/reply/`, {
    method: 'POST',
    token,
    body,
  });
}
