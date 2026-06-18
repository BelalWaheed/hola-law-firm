const API_URL = import.meta.env.VITE_API_URL || "/api";

export interface LoginCredentials {
  username?: string;
  password?: string;
}

export const login = async (credentials: LoginCredentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    } else {
      await response.text();
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
  }

  return response.json();
};
