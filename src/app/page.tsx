"use client";
import { ChatInput } from "@/components/chat-input";
import { JoinChatCard } from "@/components/join-chat";
import { Messages } from "@/components/messages";
import { useChat } from "@/hooks/use-chat";
import { useEffect, useRef } from "react";

export default function Home() {
	const {
		messages,
		sendMessage,
		authenticated,
		username,
		setUsername,
		startTyping,
		stopTyping,
		typingList,
	} = useChat();
	const endRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (!authenticated || !username)
		return <JoinChatCard setUsername={setUsername} />;

	return (
		<div className="items-center justify-center min-h-screen h-full flex font-mono">
			<div className="w-full flex-grow max-w-lg h-full flex flex-col pt-4">
				<div className="flex-1 w-full h-full flex flex-col items-start justify-end pt-4 px-px gap-4">
					<Messages messages={messages} username={username} />
					<div ref={endRef} />
				</div>
				<pre>{/* {JSON.stringify(typingList)} */}</pre>
				<ChatInput
					sendMessage={sendMessage}
					username={username}
					startTyping={startTyping}
					stopTyping={stopTyping}
					typingList={typingList}
				/>
			</div>
		</div>
	);
}
