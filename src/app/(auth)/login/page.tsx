import Image from "next/image";

import { Credits } from "@/components/credits";
import type { Metadata } from "next";
import logoBlack from "../../../..//public/logo-letter-black.svg";
import logoWhite from "../../../../public/logo-letter-white.svg";

import { LoginForm } from "./form";
export const metadata: Metadata = {
	title: "Login",
};

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
			<LoginForm />

			<Credits />
		</div>
	);
}
