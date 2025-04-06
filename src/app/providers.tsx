"use client";
import type { PropsWithChildren } from "react";

import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: PropsWithChildren) => (
	<ThemeProvider
		attribute="class"
		defaultTheme="system"
		enableSystem
		disableTransitionOnChange
	>
		{children}
	</ThemeProvider>
);
