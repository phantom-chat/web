import { TypingPayload } from "@/hooks/use-chat";
import { Ellipsis, Send } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type ChatInputProps = {
	sendMessage: (message: string) => Promise<void>;
	username: string;
	startTyping: () => void;
	stopTyping: () => void;
	typingList: TypingPayload[]
}

export const ChatInput = ({ sendMessage, username, startTyping, stopTyping, typingList }: ChatInputProps) => {
	const [message, setMessage] = useState<string | null>(null);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleSend = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const message = formData.get("message") as string;

		setMessage("");

		stopTyping();
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}
		await sendMessage(message);
	};

	const handleTyping = () => {
		startTyping();

		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		typingTimeoutRef.current = setTimeout(() => {
			stopTyping();
		}, 5000);
	};

	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, []);

	return (
		<div className="sticky bottom-0">
			<form
				onSubmit={handleSend}
				className="flex relative bg-gradient-to-b from-transparent to-25% to-background bottom-0 py-4 z-20 flex-row w-full items-center justify-between gap-2"
			>
				{
					typingList.length !== 0 && (
						<p className="text-xs absolute -top-2.5 inline-flex items-center justify-center gap-2">
							{typingList
								.map((c) => c.username)
								.join(', ')} is typing...
						</p>
					)
				}
				<Input
					autoFocus
					onInput={handleTyping}
					name="message"
					className="w-full"
					placeholder={`message #chat as @${username}`}
					value={message || ""}
					onChange={(e) => setMessage(e.currentTarget.value)}
					autoComplete="off"
				/>
				<Button type="submit" disabled={!message} size="icon">
					<Send />
				</Button>
			</form>
		</div>
	)
}