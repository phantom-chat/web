import { revalidate } from "@/actions/revalidate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth";
import Image from "next/image";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useState } from "react";
import logoBlack from "../../public/logo-letter-black.svg";
import logoWhite from "../../public/logo-letter-white.svg";

type JoinChatCardProps = {
	setUsername: Dispatch<SetStateAction<string | undefined>>;
};

export const JoinChatCard = ({ setUsername }: JoinChatCardProps) => {
	const { isAuthenticated, user, logout } = useAuth();

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
				className="w-full max-w-[320px] flex flex-col p-4  gap-2 rounded-lg"
				onSubmit={() => {
					revalidate("/");
				}}
			>
				<Button type="submit" disabled={!isAuthenticated}>
					join chat
				</Button>
				{isAuthenticated && (
					<p className="text-center text-sm text-muted-foreground">
						connected as <b>@{user?.username}</b>.{" "}
						<button
							onClick={logout}
							className="cursor-pointer hover:text-primary transition"
						>
							logout
						</button>
					</p>
				)}
			</form>
			<p className="max-w-sm text-sm text-center mt-4  text-muted-foreground absolute bottom-4">
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
};
