import type { Profile, ProfileDTO } from "./profile.type";
import { mapProfileDTOToModel } from "./profile.type";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  process.env.EXPO_PUBLIC_BACKEND_URL?.trim() ||
  "https://python-gold-savings.onrender.com"; // https://python-gold-savings.onrender.com

// Custom error class for Profile API errors
export class ProfileApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ProfileApiError";
    this.status = status;
  }
}

export async function getProfiles(token: string): Promise<Profile[]> {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Replace with actual token if needed
    },
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const payload = await response.json();
      if (payload?.detail) {
        errorMessage = payload.detail;
      }
    } catch {
      const text = await response.text();
      if (text) {
        errorMessage = text;
      }
    }

    throw new ProfileApiError(errorMessage, response.status);
  }

  const payload: unknown = await response.json();

  if (!Array.isArray(payload)) {
    throw new ProfileApiError(
      "Invalid Profile response payload",
      response.status,
    );
  }

  return payload.map((profile) => mapProfileDTOToModel(profile as ProfileDTO));
}
