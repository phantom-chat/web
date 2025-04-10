"use client";
import type { PropsWithChildren } from "react";

import { AuthProvider } from "@/contexts/auth";
import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: PropsWithChildren) => (
	<AuthProvider>
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			{children}
		</ThemeProvider>
	</AuthProvider>
);
