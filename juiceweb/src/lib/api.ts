const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function api(path: string, options?: RequestInit) {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })
}
