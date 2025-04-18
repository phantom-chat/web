"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTransition } from "react";
import { Button } from "./ui/button";

export const ThemeSwitcher = () => {
	const { setTheme, resolvedTheme } = useTheme();
	const [, startTransition] = useTransition()

	return (
		<Button
			className="fixed right-4 bottom-4"
			onClick={() => {
				startTransition(() => {
					setTheme(resolvedTheme === "dark" ? "light" : "dark")
				})
			}}
			variant="outline"
			size="icon"
		>
			<Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
};
