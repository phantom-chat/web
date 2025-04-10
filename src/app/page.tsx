"use client";
import { ChatInput } from "@/components/chat-input";
import { JoinChatCard } from "@/components/join-chat";
import { Messages } from "@/components/messages";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth";
import { useChat } from "@/hooks/use-chat";
import { useMergedRef } from "@/hooks/use-merged-ref";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function Home() {
	const { user } = useAuth();
	const {
		messages,
		sendMessage,
		socketAuthenticated,
		username,
		setUsername,
		startTyping,
		stopTyping,
		typingList,
	} = useChat();
	const { ref, inView } = useInView();
	const endRef = useRef<HTMLDivElement>(null);
	const mergedEndRefs = useMergedRef(ref, endRef);

	useEffect(() => {
		const message = messages.at(-1);
		const isOwnMessage =
			message?.event === "messageCreate" && message.author.id === user?.id;

		if (inView || isOwnMessage) {
			endRef.current?.scrollIntoView({ behavior: "instant" });
		}
	}, [messages]);

	if (!socketAuthenticated) return <JoinChatCard setUsername={setUsername} />;

	return (
		<div className="items-center justify-center min-h-screen h-full flex font-mono">
			<div className="w-full flex-grow max-w-lg mt-auto h-full flex flex-col pt-4">
				<ScrollArea>
					<div className="flex-1 w-full h-full flex flex-col items-start justify-end pt-4 px-px gap-4">
						<Messages messages={messages} />
						<div ref={mergedEndRefs} />
					</div>
				</ScrollArea>
				<ChatInput
					sendMessage={sendMessage}
					startTyping={startTyping}
					stopTyping={stopTyping}
					typingList={typingList}
				/>
			</div>
		</div>
	);
}
