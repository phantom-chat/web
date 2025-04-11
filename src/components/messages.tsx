import { useAuth } from "@/contexts/auth";
import { useChat } from "@/contexts/chat";
import { GroupedMessage } from "@/hooks/use-chat";
import { formatTime } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";
import { Message } from "./message";


export function Messages() {
	const { user } = useAuth();
	const { groupedMessages } = useChat()
	return groupedMessages.map((message, index) => {

		const isMe = user?.id === message.author.id;

		return (
			<div
				className="w-full flex flex-col gap-1 relative animate-in fade-in slide-in-from-bottom-4 duration-300"
				key={index}
			>
				{!isMe && (
					<p className="font-bold text-muted-foreground text-sm gap-1 inline-flex items-center">
						{message.author.bot && <Bot className="size-4" />}@
						{message.author.username}
					</p>
				)}

				<div
					className={cn(
						"w-fit flex-col py-1 border text-sm min-w-1/12 bg-secondary rounded-lg max-w-11/12 overflow-hidden break-words hyphens-auto",
						isMe && "bg-secondary/50 border-border/50",
					)}
				>
					{message.messages.map((msg) => (
						<Message {...msg} authorId={message.author.id} key={msg.id} />
					))}
				</div>

				<span className="text-muted-foreground/80 text-xs">
					{formatTime(message.messages[0].createdAt)}
				</span>
			</div>
		);
	});
}
