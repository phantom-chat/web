import { type Message, groupMessages } from "@/hooks/use-chat";
import { formatTime } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";
import { text } from "stream/consumers";

type MessagesProps = {
	messages: Message[];
	username: string;
};

export function Messages({ messages, username }: MessagesProps) {
	const urlRegex = /(https?:\/\/[^\s]+)/g;

	function parseTextWithLinks(text: string) {
		const regex =
			/((?:https?:\/\/|www\.)[^\s]+|[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}|\+?\d[\d\s\-().]{7,}\d)/g;

		const result: (ReactNode | string)[] = [];
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(text)) !== null) {
			const { index } = match;
			const part = match[0];

			if (lastIndex < index) {
				result.push(text.slice(lastIndex, index));
			}

			let href = "";
			let isValid = false;

			if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(part)) {
				href = `mailto:${part}`;
				isValid = true;
			}

			else if (/^(https?:\/\/|www\.)[^\s]+$/.test(part)) {
				href = part.startsWith("http") ? part : `https://${part}`;
				isValid = true;
			}

			else if (/^\+?\d[\d\s\-().]{7,}\d$/.test(part)) {
				const cleaned = part.replace(/[^\d+]/g, "");
				href = `tel:${cleaned}`;
				isValid = true;
			}

			if (isValid) {
				result.push(
					<Link
						key={index}
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:underline"
					>
						{part}
					</Link>
				);
			} else {
				result.push(part);
			}

			lastIndex = index + part.length;
		}

		if (lastIndex < text.length) {
			result.push(text.slice(lastIndex));
		}

		return result;
	}
	return groupMessages(messages).map((message, index) => {
		if (message.type === "memberEvent") {
			return (
				<div
					className="w-full flex items-center justify-center text-sm"
					key={index}
				>
					<p>
						<b>@{message.user}</b>{" "}
						{message.action === "add" ? "joined" : "left"} the chat
					</p>
				</div>
			);
		}

		const isMe = username === message.author;

		return (
			<div className="w-full flex flex-col gap-1 relative" key={index}>
				{!isMe && (
					<p className="font-bold text-muted-foreground text-sm">
						@{message.author}
					</p>
				)}

				<div
					className={cn(
						"w-fit flex flex-col border p-2.5 text-sm bg-secondary rounded-lg gap-2 max-w-11/12 break-words",
						isMe ? "ml-auto text-end" : "mr-auto",
					)}
				>
					<div className="flex flex-col gap-1.5">
						{message.messages.map((msg, i) => (
							<p key={i}>{parseTextWithLinks(msg.content)}</p>
						))}
					</div>
				</div>

				<span
					className={cn(
						"text-muted-foreground/80 text-xs",
						isMe ? "ml-auto" : "mr-auto",
					)}
				>
					{formatTime(message.messages[0].timestamp)}
				</span>
			</div>
		);
	});
}
