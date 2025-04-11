"use client";
import { Input } from "@/components/chat/input";
import { UserList } from "@/components/chat/user-list";
import { JoinChatCard } from "@/components/join-chat";
import { Messages } from "@/components/messages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPopover } from "@/components/user-popover";
import { useAuth } from "@/contexts/auth";
import { useChat } from "@/contexts/chat";
// import { useChat } from "@/hooks/use-chat";
import { useMergedRef } from "@/hooks/use-merged-ref";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function Home() {
	const { user } = useAuth();
	const {
		messages,
		sendMessage,
		socketAuthenticated,
		users,
		groupedMessages
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

	if (!socketAuthenticated) return <JoinChatCard />;


	return (
		<div className="items-center justify-center min-h-screen h-full flex font-mono">
			<div className="w-full flex-grow max-w-2xl mt-auto justify-end flex flex-col pt-4 relative h-screen px-4">
				<ScrollArea>
					<div className="flex-1 w-full h-full flex flex-col items-start justify-end pt-4 px-px gap-4">
						<Messages />
						<div ref={mergedEndRefs} />
					</div>
				</ScrollArea>
				<Input />

				<UserList />
			</div>
		</div>
	);
}
