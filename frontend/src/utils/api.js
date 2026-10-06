const API =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

export async function api(path, opts = {}) {
  const token = localStorage.getItem('token');

  const response = await fetch(API + path, {
    ...opts,

    headers: {
      'Content-Type': 'application/json',

      ...(token
        ? {
            Authorization: 'Bearer ' + token
          }
        : {}),

      ...(opts.headers || {})
    }
  });

  let data = {};

  try {
    data = await response.json();
  } catch {}

  if (!response.ok) {
    throw new Error(
      data.error || 'Request failed'
    );
  }

  return data;
}

export { API };