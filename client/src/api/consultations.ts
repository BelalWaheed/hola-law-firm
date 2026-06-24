const API_URL = import.meta.env.VITE_API_URL || "/api";

export interface CreateConsultationData {
  clientName: string;
  phone: string;
  consultationType: string;
  details: string;
}

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createConsultation = async (data: CreateConsultationData) => {
  const response = await fetch(`${API_URL}/consultations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to submit request");
  }

  return response.json();
};

export const getDashboardStats = async () => {
  const response = await fetch(`${API_URL}/consultations/dashboard-stats`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
};

export const getLatestSync = async () => {
  const response = await fetch(`${API_URL}/consultations/latest-sync`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch latest sync status");
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

export const checkConsultationStatus = async (phone: string) => {
  const response = await fetch(`${API_URL}/consultations/status?phone=${encodeURIComponent(phone)}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to query status");
  }
  return response.json();
};
