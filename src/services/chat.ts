import { API_ENDPOINTS } from "@/config/api";
import { Status } from "@/contexts/auth";
import cookies from "js-cookie";
import { toast } from "sonner";
import { apiService } from "./api";

export class ChatService {
    static async deleteMessage(id: string) {
        return apiService.delete(API_ENDPOINTS.DELETE_MESSAGE, {
            id: Number(id),
        });
    }

    static async sendMessage(content: string) {
        return apiService.post(API_ENDPOINTS.CREATE_MESSAGE, { content });
    }

    static async updateStatus(status: Status) {
        return apiService.patch(API_ENDPOINTS.UPDATE_USER, { status });
    }

    static handleAuthError() {
        toast.error("You are not logged in.");
        cookies.remove("phantom-token");
        window.location.href = "/login";
    }
}