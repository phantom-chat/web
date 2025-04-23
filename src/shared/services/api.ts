import { API_ENDPOINTS } from "@/config/api";
import cookies from "js-cookie";

export class ApiService {
    private getAuthHeaders() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("phantom-token")} `,
        };
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(endpoint, {
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error("API error");
        }

        return response.json();
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("API error");
        }

        return response.json();
    }

    async patch<T>(endpoint: string, data: any): Promise<T> {
        const response = await fetch(endpoint, {
            method: "PATCH",
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("API error");
        }

        return response.json();
    }

    async delete<T>(endpoint: string, data: any): Promise<T> {
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("API error");
        }

        return response.json();
    }
}

export const apiService = new ApiService();