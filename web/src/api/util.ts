// standardized fetch wrapper where T is the type of the response
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await window.fetch(url, options);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

// Get request wrapper
export function get<T>(url: string): Promise<T> {
  return fetcher<T>(url);
}

// Post request wrapper
export function post<T>(url: string, body: any): Promise<T> {
  return fetcher<T>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
