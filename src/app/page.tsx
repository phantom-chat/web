"use client";
import { Chat } from "@/components/chat/chat";
import { UserList } from "@/components/chat/user-list";
import { JoinChatCard } from "@/components/join-chat";
import { Sidebar } from "@/components/user/sidebar";
import { useChat } from "@/contexts/chat";

export default function Home() {
	const { socketAuthenticated } = useChat();

	if (!socketAuthenticated) return <JoinChatCard />;

	return (
		<div className="justify-center min-h-screen h-full items-center grid grid-cols-1 lg:grid-cols-3 font-mono">
			<Sidebar />
			<Chat />
			<UserList />
		</div>
	);
}
