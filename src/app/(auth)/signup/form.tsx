"use client";
import { login } from "@/actions/login";
import { signup } from "@/actions/signup";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
	.object({
		username: z
			.string()
			.min(4, { message: "Username must contain at least 3 characters" })
			.max(16, { message: "Username must contain at most 16 characters." })
			.regex(/^[a-zA-Z0-9_]+$/, {
				message: "Username can only contain letters, numbers, and underscores.",
			}),
		email: z.string().email({ message: "Invalid email address." }),
		password: z
			.string()
			.min(6, { message: "Password must contain at least 6 characters" })
			.max(20, { message: "Password must contain at most 20 characters." }),
		confirmPassword: z
			.string()
			.min(6, { message: "Password must contain at least 6 characters" })
			.max(20, { message: "Password must contain at most 20 characters." }),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: "custom",
				message: "The passwords did not match",
				path: ["confirmPassword"],
			});
		}
	});

export const SignupForm = () => {
	const [isPending, startTransition] = useTransition();
	const [state, action] = useActionState(signup, null);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
			confirmPassword: "",
			email: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		const formData = new FormData();

		formData.append("username", values.username);
		formData.append("password", values.password);
		formData.append("email", values.email);

		startTransition(() => {
			action(formData);
		});
	}

	useEffect(() => {
		if (state?.success === false) {
			toast.error(state?.message);
			return;
		}
		if (state?.success === true) {
			toast.success("Account created successfully, now log in.");
			redirect("/login");
		}
	}, [state]);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full max-w-[320px] flex flex-col p-4 border gap-2.5 rounded-lg"
			>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="Place your username" {...field} />
							</FormControl>
							<FormMessage className="text-xs w-full" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-mail</FormLabel>
							<FormControl>
								<Input
									placeholder="Place your e-mail"
									type="email"
									{...field}
								/>
							</FormControl>
							<FormMessage className="text-xs w-full" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									placeholder="Place your password"
									type="password"
									{...field}
								/>
							</FormControl>
							<FormMessage className="text-xs w-full" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm password</FormLabel>
							<FormControl>
								<Input
									placeholder="Confirm your password"
									type="password"
									{...field}
								/>
							</FormControl>
							<FormMessage className="text-xs w-full" />
						</FormItem>
					)}
				/>
				<Button type="submit">Create Account</Button>
				<p className="text-center text-xs text-muted-foreground">
					Already have an account?{" "}
					<Link
						href="/login"
						className="text-primary underline underline-offset-2 transition"
					>
						Login
					</Link>
				</p>
			</form>
		</Form>
	);
};
