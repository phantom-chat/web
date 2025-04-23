"use client";
import type { PropsWithChildren } from "react";

import { AuthProvider } from "@/features/auth/context";
import { ChatProvider } from "@/features/chat/context";
import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: PropsWithChildren) => (
	<AuthProvider>
		<ChatProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<div onContextMenu={(e) => e.preventDefault()}>{children}</div>
			</ThemeProvider>
		</ChatProvider>
	</AuthProvider>
);
