import cookies from "js-cookie";
import { redirect } from "next/navigation";
import { User } from "./types";
const API_BASE_URL = "http://100.94.141.111:3333";

export const createAuthService = (
    setUser: (user: User | null) => void,
    setIsAuthenticated: (value: boolean) => void
) => {
    const fetchCurrentUser = async () => {
        const token = cookies.get("phantom-token");
        if (!token) return null;

        try {
            const res = await fetch(`${API_BASE_URL}/users/@me`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 401) {
                setUser(null);
                setIsAuthenticated(false);
                cookies.remove("phantom-token");
                return redirect("/login");
            }

            const userData = await res.json() as User;
            setUser(userData);
            setIsAuthenticated(true);
            return userData;
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