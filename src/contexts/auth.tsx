"use client";
import cookies from "js-cookie";
import { redirect } from "next/navigation";

import {
	type Dispatch,
	type PropsWithChildren,
	type SetStateAction,
	createContext,
	use,
	useEffect,
	useState,
} from "react";

export type User = {
	id: string;
	email: string;
	status: "online" | "offline" | "idle";
	username: string;
	createdAt: string;
	bot: boolean;
};

type AuthType = {
	isAuthenticated: boolean;
	user: User | null;
	logout: () => void;
	setUser: Dispatch<SetStateAction<User | null>>;
};

const AuthContext = createContext({
	isAuthenticated: false,
	user: null,
	setUser: (user: User | null) => { },
	logout: () => { },
} as AuthType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const token = cookies.get("phantom-token");
		if (user !== null) return;
		if (!token) return;
		const fetchUser = async () => {
			const res = await fetch("http://100.94.141.111:3333/users/@me", {
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

			const json = await res.json();

			const userJSON = json.user as User;
			setUser(userJSON);
			setIsAuthenticated(true);
		};
		fetchUser();
	}, [cookies.get("phantom-token")]);

	const logout = () => {
		cookies.remove("phantom-token");
		setIsAuthenticated(false);
		setUser(null);
	};

	return (
		<AuthContext value={{ isAuthenticated, user, logout, setUser }}>
			{children}
		</AuthContext>
	);
};

export const useAuth = () => use(AuthContext);
