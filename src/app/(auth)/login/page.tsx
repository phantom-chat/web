import Image from "next/image";

import { login } from "@/actions/login";
import { Credits } from "@/components/credits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Metadata } from "next";
import Link from "next/link";
import logoBlack from "../../../../public/logo-letter-black.svg";
import logoWhite from "../../../../public/logo-letter-white.svg";

export const metadata: Metadata = {
	title: 'Login',
}

export default function LoginPage() {
	return (
		<div className="items-center justify-center flex-col flex h-screen font-mono">
			<div className="inline-flex items-center gap-2">
				<Image
					src={logoWhite}
					className="hidden dark:block"
					alt="Logo"
					width={360}
					height={120}
				/>
				<Image
					src={logoBlack}
					className="block dark:hidden"
					alt="Logo"
					width={360}
					height={120}
				/>
			</div>
			<form
				className="w-full max-w-[320px] flex flex-col p-4 border gap-2.5 rounded-lg"
				action={login}
			>
				<div className="grid gap-2">
					<Label>Username</Label>
					<Input
						name="login"
						placeholder="Place your username"
						minLength={3}
						maxLength={16}
					/>
				</div>

				<div className="grid gap-2">
					<Label>Password</Label>
					<Input
						name="password"
						placeholder="Place your password"
						minLength={3}
						maxLength={16}
						type="password"
					/>
				</div>

				<Button type="submit" className="mt-2">
					Login
				</Button>
				<p className="text-xs text-center text-muted-foreground">
					or{" "}
					<Link
						href="/signup"
						className="text-primary underline transition underline-offset-2"
					>
						create an account
					</Link>
				</p>
			</form>
			<Credits />
		</div>
	);
}
