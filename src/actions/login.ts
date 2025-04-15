"use server";

import { cookies } from "next/headers";

type Response =
	| {
		success: true;
		id: string;
		email: string;
		username: string;
		createdAt: string;
		token: string;
	}
	| {
		success: false;
		message: string;
	};

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
		const data = (await res.json()) as Response;

		if (data.success === false) { throw data.message }

		(await cookies()).set("phantom-token", data.token, {
			expires: Date.now() + 3_600_000,
		});
		return { success: true }
	} catch (err) {
		return { success: false, message: err as string }
	}
}
