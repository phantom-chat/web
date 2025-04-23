import { API_ENDPOINTS } from "@/config/api";
import { apiService } from "@/shared/services/api";
import cookies from "js-cookie";
import { redirect } from "next/navigation";
import { User } from "./types";

export const createAuthService = (
    setUser: (user: User | null) => void,
    setIsAuthenticated: (value: boolean) => void
) => {
    const fetchCurrentUser = async () => {
        const token = cookies.get("phantom-token");
        if (!token) return null;

        try {
            const user = await apiService.get<User>(API_ENDPOINTS.CURRENT_USER);

            if (!user) {
                setUser(null);
                setIsAuthenticated(false);
                cookies.remove("phantom-token");
                return redirect("/login");
            }

            setUser(user);
            setIsAuthenticated(true);
            return user;
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
            setIsAuthenticated(false);
            return null;
        }
    };

    const logout = () => {
        cookies.remove("phantom-token");
        setIsAuthenticated(false);
        setUser(null);
    };

    return {
        fetchCurrentUser,
        logout
    };
};