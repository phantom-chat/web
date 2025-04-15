// import { GroupedMessage, groupMessages, Message, TypingPayload } from "@/hooks/use-chat";
import { type User, useAuth } from "@/contexts/auth";
import { emitter, HandshakeEvent, MessageCreateEvent, MessageDeleteEvent, MessagesFetchEvent, UsersFetchEvent } from "@/lib/emitter";
import { formatMessage } from "@/lib/format-message";
import { Message } from "@/types/message";
import { default as cookie } from "js-cookie";
import { createContext, PropsWithChildren, use, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export enum Events {
	MESSAGE_CREATE = "messageCreate",
	MESSAGE_DELETE = "messageDelete",
	USERS_FETCH = "usersFetch",
	MESSAGE_FETCH = "messagesFetch",
	HANDSHAKE = "handshake",
}

type Author = {
	id: string;
	username: string;
	createdAt: string;
	bot: boolean;
};

type MessagePayload = HandshakeEvent | MessagesFetchEvent | UsersFetchEvent | MessageCreateEvent | MessageDeleteEvent;


export type GroupedMessage = {
	type: "messageEvent";
	author: {
		id: string;
		username: string;
		createdAt: string;
		bot: boolean;
	};
	messages: {
		id: string;
		content: string;
		createdAt: number;
	}[];
}


export function groupMessages(messages: Message[]): GroupedMessage[] {
	const result: GroupedMessage[] = [];
	let currentAuthor: Author | null = null;
	let currentMessages: {
		id: string;
		content: string;
		createdAt: number;
	}[] = [];

	const flushCurrentMessages = () => {
		if (currentAuthor && currentMessages.length > 0) {
			result.push({
				type: "messageEvent",
				author: currentAuthor,
				messages: [...currentMessages],
			});
			currentMessages = [];
		}
	};

	for (const message of messages) {
		if (message.event === "messageCreate") {
			if (!currentAuthor || message.author.id !== currentAuthor.id) {
				flushCurrentMessages();
				currentAuthor = {
					id: message.author.id,
					username: message.author.username,
					createdAt: message.author.createdAt,
					bot: message.author.bot,
				};
			}

			currentMessages.push({
				id: message.id,
				content: message.content,
				createdAt: Number(new Date(message.createdAt)),
			});
		}
	}

	flushCurrentMessages();
	return result;
}

type ChatContextType = {
	messages: Message[];
	sendMessage: (content: string) => Promise<void>;
	deleteMessage: (id: string) => Promise<void>;
	users: User[];
	socketAuthenticated: boolean;
	groupedMessages: GroupedMessage[];
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: PropsWithChildren) => {
	const { isAuthenticated, user, setUser } = useAuth();
	const [messages, setMessages] = useState<Message[]>([]);
	const groupedMessages = useMemo(() => groupMessages(messages), [messages]);
	const socket = useRef<WebSocket>(null)
	const [users, setUsers] = useState<User[]>([]);
	const [socketAuthenticated, setSocketAuthenticated] =
		useState<boolean>(false);


	useEffect(() => {
		const userStatus = users.find((u) => Number(u.id) === Number(user?.id))?.status

		console.log(userStatus)
		setUser((prev) => {
			if (!prev) return null;
			if (!userStatus) return prev;
			return {
				...prev,
				status: userStatus as "online" | "offline" | "idle"
			}
		})
	}, [users])
	useEffect(() => {
		if (!user) return;
		if (!isAuthenticated) return;
		const ws = new WebSocket("ws://100.94.141.111:3333/chat");
		socket.current === ws;
		ws.onopen = () => {
			setMessages([]);
			const handshakeMessage = {
				event: "handshake",
				type: "request",
				token: cookie.get("phantom-token"),
				timestamp: Date.now(),
			};
			ws.send(JSON.stringify(handshakeMessage));
		};

		ws.onclose = () => {
			toast.error("connection lost. Try again later.");
			setSocketAuthenticated(false);
		};

		emitter.on("handshake", (data) => {
			if (data.status === "success") {
				toast.success("you are logged in.");
				return setSocketAuthenticated(true);
			}
			toast.error("authentication failed. try again later.");
			return setSocketAuthenticated(false);
		});

		emitter.on("usersFetch", ({ users }) => { setUsers(users); });

		emitter.on("messagesFetch", ({ messages }) => { setMessages((prev) => [...formatMessage(messages), ...prev]) });

		emitter.on("messageCreate", (message) => { setMessages((prev) => [...prev, message]) });

		emitter.on("messageDelete", ({ id }) => { setMessages((prev) => prev.filter((msg) => msg.id !== String(id))); });



		ws.onmessage = (event) => {
			const data = JSON.parse(event.data) as MessagePayload;

			switch (data.event) {
				case Events.HANDSHAKE:
					emitter.emit("handshake", data);
					break;
				case Events.MESSAGE_FETCH:
					emitter.emit("messagesFetch", data);
					break;
				case Events.USERS_FETCH:
					emitter.emit("usersFetch", data);
					break;
				case Events.MESSAGE_CREATE:
					emitter.emit("messageCreate", data);
					break;
				case Events.MESSAGE_DELETE:
					emitter.emit("messageDelete", data);
					break;
			}
		};


		return () => {
			if (socket.current &&
				(socket.current.readyState === WebSocket.OPEN ||
					socket.current.readyState === WebSocket.CONNECTING)
			) {
				socket.current.close();
			}
		};
	}, [isAuthenticated]);

	const deleteMessage = async (id: string) => {
		await fetch("http://100.94.141.111:3333/messages/delete", {
			method: "DELETE",
			body: JSON.stringify({
				id: Number(id),
			}),
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + cookie.get("phantom-token"),
			},
		});
		void 0;
	};

	const sendMessage = async (message: string) => {
		const trimmedMessage = message.trim();

		if (!trimmedMessage) {
			return;
		}

		await fetch("http://100.94.141.111:3333/messages/create", {
			method: "POST",
			body: JSON.stringify({
				content: trimmedMessage,
			}),
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + cookie.get("phantom-token"),
			},
		});
		void 0;
	};
	return (

		<ChatContext value={{
			sendMessage,
			messages,
			socketAuthenticated,
			users,
			groupedMessages,
			deleteMessage
		}}>
			{children}
		</ChatContext>
	)
}

export function useChat() {
	const context = use(ChatContext);
	if (!context) {
		throw new Error("useChat must be used within a ChatProvider");
	}
	return context;
}