import type { LandingPageContent } from "../data/landingData";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export interface CreateConsultationData {
  clientName: string;
  phone: string;
  consultationType: string;
  details: string;
}

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

export const getSiteSettings = async () => {
  const response = await fetch(`${API_URL}/settings`);
  if (!response.ok) throw new Error("Failed to fetch settings");
  return response.json();
};

export const updateSiteSettings = async (data: LandingPageContent) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update settings");
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
