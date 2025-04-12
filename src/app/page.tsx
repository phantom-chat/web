"use client";
import { Input } from "@/components/chat/input";
import { UserList } from "@/components/chat/user-list";
import { JoinChatCard } from "@/components/join-chat";
import { Messages } from "@/components/messages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserInfo } from "@/components/user-info";
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
		socketAuthenticated,
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
	// 1/2/1 = 4
	return (
		<div className="justify-center min-h-screen h-full items-center grid grid-cols-1 lg:grid-cols-3 font-mono">

			<div className="h-full w-full justify-end hidden lg:flex">
				<div className="border-l px-2 w-64 h-full flex justify-end flex-col gap-4 py-4">
					<UserInfo />
				</div>
			</div>
			<div className="w-full border-x flex-grow max-w-2xl mt-auto justify-end flex flex-col pt-4 h-screen px-2">
				<ScrollArea>
					<div className="flex-1 w-full h-full flex flex-col items-start justify-end pt-4 px-px gap-4">
						<Messages />
						<div ref={mergedEndRefs} />
					</div>
				</ScrollArea>
				<Input />
			</div>

			<UserList />
		</div>
	);
}
