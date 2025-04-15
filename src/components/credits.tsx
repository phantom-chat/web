import Link from "next/link";

export const Credits = () => {
	return (
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
	);
};
