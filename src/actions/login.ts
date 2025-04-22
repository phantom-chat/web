"use server";

import { Status } from "@/contexts/auth";
import { cookies } from "next/headers";

type Success = {
	user: {
		id: number;
		email: string;
		status: Status;
		username: string;
		password: string;
		createdAt: Date;
		bot: boolean;
	},
	token: string;
}

type LoginResponse = Success | { success: false; message: string; };

export async function login(_: unknown, formData: FormData) {
	const login = formData.get("login") as string;
	const password = formData.get("password") as string;
	try {
		const res = await fetch("http://100.94.141.111:3333/users/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				login,
				password,
			}),
		});
		const data = (await res.json()) as LoginResponse;

		if ('success' in data) {
			return { success: false, message: "Invalid username or password" };
		}

		(await cookies()).set("phantom-token", data.token, {
			expires: Date.now() + 3_600_000,
		});
		return { success: true };
	} catch (err) {
		return { success: false, message: "An error occurred during login" };
	}
}
