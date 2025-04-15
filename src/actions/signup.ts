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

// email, username, password
export async function signup(_: unknown, formData: FormData) {
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
        const res = await fetch("http://100.94.141.111:3333/users/create", {
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
        const data = (await res.json()) as Response;

        if (data.success === false) { throw data.message }

        // redirect
        return { success: true }
    } catch (err) {
        return { success: false, message: err as string }
    }
}
