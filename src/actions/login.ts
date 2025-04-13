"use server";

import { emitter } from "@/lib/emitter";
// import { useChat } from "@/contexts/chat";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

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

export async function login(formData: FormData) {
	// const { connectWebSocket } = useChat();
	const login = formData.get("login") as string;
	const password = formData.get("password") as string;

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

	if (data.success === false) return;

	(await cookies()).set("phantom-token", data.token, {
		expires: Date.now() + 3_600_000,
	});


	// await connectWebSocket();
	redirect("/", RedirectType.replace);
}
