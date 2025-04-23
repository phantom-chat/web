"use client";
import { JoinChatCard } from "@/features/auth/components/join-chat";
import { Chat } from "@/features/chat/components/chat";
import { UserList } from "@/features/chat/components/user-list";
import { Sidebar } from "@/features/chat/components/user/sidebar";
import { useChat } from "@/features/chat/context";

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
