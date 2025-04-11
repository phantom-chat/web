import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { Metadata } from "next";
import logoBlack from "../../../../public/logo-letter-black.svg";
import logoWhite from "../../../../public/logo-letter-white.svg";

export const metadata: Metadata = {
	title: 'Sign up',
}

export default function SignUpPage() {
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
			<form className="w-full max-w-[320px] flex flex-col p-4 border gap-2.5 rounded-lg">
				<div className="grid gap-2">
					<Label>e-mail</Label>
					<Input
						placeholder="place your e-mail"
						minLength={3}
						maxLength={16}
						type="email"
					/>
				</div>
				<div className="grid gap-2">
					<Label>username</Label>
					<Input
						placeholder="place your username"
						minLength={3}
						maxLength={16}
					/>
				</div>

				<div className="grid gap-2">
					<Label>password</Label>
					<Input
						placeholder="place your password"
						minLength={3}
						maxLength={16}
						type="password"
					/>
				</div>
				<div className="grid gap-2">
					<Label>confirm password</Label>
					<Input
						placeholder="place your password again"
						minLength={3}
						maxLength={16}
						type="password"
					/>
				</div>

				<Button type="submit" className="mt-2">
					login
				</Button>

				<p className="text-center text-xs text-muted-foreground">
					already have an account?{" "}
					<Link
						href="/login"
						className="text-primary underline underline-offset-2 transition"
					>
						login
					</Link>
				</p>
			</form>
			<p className="max-w-xs text-sm text-center mt-4  text-muted-foreground">
				made with 🖤 by{" "}
				<Link
					target="_blank"
					href="https://github.com/upenha"
					className="hover:text-primary underline transition underline-offset-2"
				>
					upenha
				</Link>
				,{" "}
				<Link
					target="_blank"
					href="https://github.com/joaotonaco"
					className="hover:text-primary underline transition underline-offset-2"
				>
					joaotonaco
				</Link>{" "}
				&{" "}
				<Link
					target="_blank"
					href="https://github.com/lyricalsoul"
					className="hover:text-primary underline transition underline-offset-2"
				>
					lyricalsoul
				</Link>
			</p>
		</div>
	);
}
