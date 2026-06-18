const API_URL = import.meta.env.VITE_API_URL || "/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getDashboardStats = async () => {
  const response = await fetch(`${API_URL}/consultations/dashboard-stats`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
};

export const getConsultations = async () => {
  const response = await fetch(`${API_URL}/consultations`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch consultations");
  return response.json();
};

export const updateConsultationStatus = async (id: string, status: string, adminReply?: string) => {
  const payload: { status: string; adminReply?: string } = { status };
  if (adminReply !== undefined) {
    payload.adminReply = adminReply;
  }

  const response = await fetch(`${API_URL}/consultations/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update status");
  }
  return response.json();
};
