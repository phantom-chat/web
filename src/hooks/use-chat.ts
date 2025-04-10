"use client";

import { useAuth } from "@/contexts/auth";
import cookie from "js-cookie";
import { useEffect, useState } from "react";

type Author = {
	id: string;
	username: string;
	createdAt: string;
	bot: boolean;
};

export type Message =
	| {
			event: "messageCreate";
			id: string;
			author: {
				id: string;
				username: string;
				createdAt: string;
				bot: boolean;
			};
			content: string;
			timestamp: string;
	  }
	| {
			event: "memberAdd";
			user: {
				id: string;
				username: string;
				createdAt: Date;
				bot: boolean;
			};
	  }
	| {
			event: "memberDelete";
			user: {
				id: string;
				username: string;
				createdAt: Date;
				bot: boolean;
			};
	  };

export type GroupedMessage =
	| {
			type: "messageEvent";
			author: {
				id: string;
				username: string;
				createdAt: string;
				bot: boolean;
			};
			messages: {
				content: string;
				timestamp: number;
			}[];
	  }
	| {
			type: "memberEvent";
			action: "add" | "delete";
			user: {
				id: string;
				username: string;
				createdAt: Date;
				bot: boolean;
			};
	  };

export function groupMessages(messages: Message[]): GroupedMessage[] {
	const result: GroupedMessage[] = [];
	let currentAuthor: Author | null = null;
	let currentMessages: {
		content: string;
		timestamp: number;
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
				content: message.content,
				timestamp: Number(new Date(message.timestamp)),
			});
		} else {
			flushCurrentMessages();
			currentAuthor = null;

			result.push({
				type: "memberEvent",
				action: message.event === "memberAdd" ? "add" : "delete",
				user: message.user,
			});
		}
	}

	flushCurrentMessages();
	return result;
}

const TYPING_TIMEOUT = 5 * 1000; // 5_000;

export type TypingPayload = {
	username: string;
	timestamp: number;
	typing: boolean;
};

export function useChat() {
	const { isAuthenticated, user } = useAuth();
	const [messages, setMessages] = useState<Message[]>([]);
	const [username, setUsername] = useState<string>();
	const [typingList, setTypingList] = useState<TypingPayload[]>([]);
	const [isTyping, setIsTyping] = useState<boolean>();
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [socketAuthenticated, setSocketAuthenticated] =
		useState<boolean>(false);

	useEffect(() => {
		if (!user) return;
		if (!isAuthenticated) return;
		const ws = new WebSocket("ws://100.94.141.111:3333/chat");

		setSocket(ws);
		ws.onopen = (event) => {
			setTypingList([]);
			setIsTyping(false);
			setMessages([]);
			const handshakeMessage = {
				event: "handshake",
				type: "request",
				token: cookie.get("phantom-token"),
				timestamp: Date.now(),
			};
			ws.send(JSON.stringify(handshakeMessage));
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			// console.log(data)
			if (data.event === "handshake" && data.status === "success") {
				console.log("Authentication successful");
				setSocketAuthenticated(true);
			}

			if (data.event === "typingStart") {
				setTypingList([
					...typingList,
					{ username: data.user, timestamp: Date.now(), typing: true },
				]);
				return;
			}

			if (data.event === "typingStop") {
				setTypingList((prev) =>
					prev.filter((item) => item.username !== data.user),
				);
				return;
			}

			if (data.event === "clearChat") {
				setMessages([]);
			}

			const message = JSON.parse(event.data);
			setMessages((prev) => [...prev, message]);
		};

		ws.onclose = (event) => {
			// setUsername(undefined);
			setSocketAuthenticated(false);
		};

		return () => {
			if (
				ws.readyState === WebSocket.OPEN ||
				ws.readyState === WebSocket.CONNECTING
			) {
				ws.close();
			}
		};
	}, [user?.username]);

	const startTyping = () => {
		if (isTyping === true) return;
		if (!user || !socket || socket.readyState !== WebSocket.OPEN) return;
		socket?.send(
			JSON.stringify({ event: "startTyping", username: user.username }),
		);
		// setTypingList((prev) => [...prev, { username: username, timestamp: Date.now(), typing: true }])
		setIsTyping(true);
	};

	const stopTyping = () => {
		if (isTyping === false) return;
		if (!user || !socket || socket.readyState !== WebSocket.OPEN) return;
		socket?.send(
			JSON.stringify({ event: "stopTyping", username: user.username }),
		);
		// setTypingList((prev) => prev.filter((item) => item.username !== username));
		setIsTyping(false);
	};

	const sendMessage = async (message: string) => {
		if (message === "/clear") {
			return socket?.send(JSON.stringify({ event: "clearChat" }));
		}
		await fetch("http://100.94.141.111:3333/message/create", {
			method: "POST",
			body: JSON.stringify({
				content: message,
			}),
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + cookie.get("phantom-token"),
			},
		});
		void 0;
	};

	return {
		setUsername,
		sendMessage,
		startTyping,
		stopTyping,
		messages,
		username,
		socketAuthenticated,
		typingList,
	};
}
