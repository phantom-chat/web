"use client";

import { AlertTriangle, Check, Info, Loader2, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast:
						"group font-mono toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
			icons={{
				success: <Check className="size-4 text-green-500" />,
				info: <Info className="size-4 text-blue-500" />,
				warning: <AlertTriangle className="size-4 text-amber-500" />,
				error: <X className="size-4 text-red-500" />,
				loading: <Loader2 className="size-4 animate-spin text-gray-500" />,
			}}
			{...props}
		/>
	);
};

export { Toaster };
