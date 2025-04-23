"use server";

import { API_ENDPOINTS } from "@/config/api";
import { Status } from "@/features/auth/context";

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

type SignUpResponse = Success | { success: false; message: string; };

export async function signup(_: unknown, formData: FormData) {
	const email = formData.get("email") as string;
	const username = formData.get("username") as string;
	const password = formData.get("password") as string;

	try {
		const res = await fetch(API_ENDPOINTS.SIGNUP, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				username,
				password,
			}),
		});

		const data = (await res.json()) as SignUpResponse;

		if ('success' in data) {
			return { success: false, message: "User already exists. Try another username." };
		}

		return { success: true };
	} catch (err) {
		return { success: false, message: "User already exists. Try another username." };
	}
}
