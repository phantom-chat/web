import { useAuth } from "@/contexts/auth";
import { useChat } from "@/contexts/chat";
import { useMergedRef } from "@/hooks/use-merged-ref";
import { useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Input } from "./input";
import { Messages } from "./messages";

export const Chat = () => {
	const { user } = useAuth();
	const { messages } = useChat();

	const { ref, inView } = useInView({ threshold: 0.1 });
	const endRef = useRef<HTMLDivElement>(null);
	const mergedEndRefs = useMergedRef(ref, endRef);

	const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
		if (endRef.current) {
			endRef.current.scrollIntoView({ behavior });
		}
	}, []);
	useEffect(() => {
		const message = messages.at(-1);
		const isOwnMessage =
			message?.event === "messageCreate" && message.author.id === user?.id;

		if (inView || isOwnMessage) {
			scrollToBottom("smooth");
		}
	}, [messages]);
	return (
		<div className="w-full border-x flex-grow max-w-2xl flex flex-col h-screen">
			<div className="flex-1 w-full overflow-y-auto">
				<div className="flex flex-col items-start justify-end min-h-full pt-6 px-2 gap-4">
					<Messages />
					<div ref={mergedEndRefs} className="h-1" />
				</div>
			</div>
			<div className="px-2">
				<Input />
			</div>
		</div>
	);
};
