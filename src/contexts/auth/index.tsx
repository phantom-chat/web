"use client";
import cookies from "js-cookie";
import {
    type PropsWithChildren,
    createContext,
    use,
    useEffect,
    useState,
} from "react";
import { createAuthService } from "./api-service";
import { AuthType, User } from "./types";

const AuthContext = createContext<AuthType>({
    isAuthenticated: false,
    user: null,
    setUser: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const authService = createAuthService(setUser, setIsAuthenticated);

    useEffect(() => {
        const token = cookies.get("phantom-token");
        if (user !== null) return;
        if (!token) return;

        authService.fetchCurrentUser();
    }, [cookies.get("phantom-token")]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                logout: authService.logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => use(AuthContext);

export * from "./types";
