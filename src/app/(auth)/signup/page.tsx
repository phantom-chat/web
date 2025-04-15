import Image from "next/image";


import { Credits } from "@/components/credits";
import type { Metadata } from "next";
import logoBlack from "../../../../public/logo-letter-black.svg";
import logoWhite from "../../../../public/logo-letter-white.svg";
import { SignupForm } from "./form";

export const metadata: Metadata = {
	title: "Sign up",
};

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
			<SignupForm />
			{/* <form className="w-full max-w-[320px] flex flex-col p-4 border gap-2.5 rounded-lg">
				<div className="grid gap-2">
					<Label>E-mail</Label>
					<Input
						placeholder="Place your e-mail"
						minLength={3}
						maxLength={16}
						type="email"
					/>
				</div>
				<div className="grid gap-2">
					<Label>Username</Label>
					<Input
						placeholder="Place your username"
						minLength={3}
						maxLength={16}
					/>
				</div>

				<div className="grid gap-2">
					<Label>Password</Label>
					<Input
						placeholder="Place your password"
						minLength={3}
						maxLength={16}
						type="password"
					/>
				</div>
				<div className="grid gap-2">
					<Label>Confirm password</Label>
					<Input
						placeholder="Place your password again"
						minLength={3}
						maxLength={16}
						type="password"
					/>
				</div>

				<Button type="submit" className="mt-2">
					Login
				</Button>

				<p className="text-center text-xs text-muted-foreground">
					Already have an account?{" "}
					<Link
						href="/login"
						className="text-primary underline underline-offset-2 transition"
					>
						Login
					</Link>
				</p>
			</form> */}
			<Credits />
		</div>
	);
}
