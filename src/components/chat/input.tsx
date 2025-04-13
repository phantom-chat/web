import { useAuth } from "@/contexts/auth";
import { useChat } from "@/contexts/chat";
import { SendHorizonal, Smile } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
	EmojiPicker,
	EmojiPickerContent,
	EmojiPickerFooter,
	EmojiPickerSearch,
} from "../ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";


export const Input = () => {
	const { user } = useAuth();
	const { sendMessage } = useChat();
	const [message, setMessage] = useState<string>("");
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	const handleSend = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const message = formData.get("message") as string;

		setMessage("");

		await sendMessage(message);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (message.trim()) {
				sendMessage(message);
				setMessage("");
			}
		}
	};

	return (
		<div className="sticky bottom-0">
			<form
				onSubmit={handleSend}
				className="flex relative bg-gradient-to-b from-transparent to-50% to-background pb-4 z-20 flex-row w-full items-center justify-between gap-2"
			>
				<Textarea
					ref={inputRef}
					autoFocus
					name="message"
					className="w-full min-h-10 resize-none max-h-20"
					onKeyDown={handleKeyDown}
					placeholder={`Message as @${user?.username}`}
					value={message}
					onChange={(e) => setMessage(e.currentTarget.value)}
					autoComplete="off"
					minLength={1}
					maxLength={5000}
				/>
				<Popover onOpenChange={setIsOpen} open={isOpen}>
					<PopoverTrigger asChild>
						<Button size="icon" variant="secondary">
							<Smile />
						</Button>
					</PopoverTrigger>
					<PopoverContent side="top" className="w-fit p-0">
						<EmojiPicker
							className="h-[360px] font-mono"
							onEmojiSelect={({ emoji }: { emoji: string }) => {
								setMessage((prev) => {
									if (!inputRef.current) return prev + emoji;
									const cursorPosition =
										inputRef.current.selectionStart ?? prev!.length;
									setIsOpen(false);
									return (
										prev?.slice(0, cursorPosition) +
										emoji +
										prev?.slice(cursorPosition)
									);
								});
								inputRef!.current!.focus();
							}}
						>
							<EmojiPickerSearch />
							<EmojiPickerContent />
							<EmojiPickerFooter />
						</EmojiPicker>
					</PopoverContent>
				</Popover>

				<Button type="submit" disabled={!message} size="icon">
					<SendHorizonal />
				</Button>
			</form>
		</div>
	);
};
