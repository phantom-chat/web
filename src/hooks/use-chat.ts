"use client";

import { useEffect, useState } from "react";

export type Message =
	| {
			event: "messageCreate";
			author: string;
			content: string;
			timestamp: number;
	  }
	| {
			event: "memberAdd";
			user: string;
	  }
	| {
			event: "memberDelete";
			user: string;
	  };

export type GroupedMessage =
	| {
			type: "messageEvent";
			author: string;
			messages: {
				content: string;
				timestamp: number;
			}[];
	  }
	| {
			type: "memberEvent";
			action: "add" | "delete";
			user: string;
	  };

export function groupMessages(messages: Message[]): GroupedMessage[] {
	const result: GroupedMessage[] = [];
	let currentAuthor: string | null = null;
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

	messages.forEach((message) => {
		if (message.event === "messageCreate") {
			if (message.author !== currentAuthor) {
				flushCurrentMessages();
				currentAuthor = message.author;
			}
			currentMessages.push({
				content: message.content,
				timestamp: message.timestamp,
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
	});

	flushCurrentMessages();
	return result;
}

const TYPING_TIMEOUT = 5 * 1000; // 5_000;

export type TypingPayload = {
	username: string
	timestamp: number
	typing: boolean
}

export function useChat() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [username, setUsername] = useState<string>();
	const [typingList, setTypingList] = useState<TypingPayload[]>([]);
	const [isTyping, setIsTyping] = useState<boolean>();
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [authenticated, setAuthenticated] = useState<boolean>(false);
	// console.log(username)

	useEffect(() => {
		if (!username) return;
		const ws = new WebSocket("ws://26.19.71.60:3333/chat");

		setSocket(ws);
		ws.onopen = (event) => {
			console.log("WebSocket connection established");

			const handshakeMessage = {
				event: "handshake",
				type: "request",
				username: username,
				timestamp: Date.now(),
			};
			ws.send(JSON.stringify(handshakeMessage));
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			// console.log(data);
			
			if (data.type === "handshake" && data.event === "response") {
				if (data.status === "success") {
					console.log("Authentication successful");
					setAuthenticated(true);
				} else {
					console.error("Authentication failed:", data.message);
					ws.close();
				}
				return;
			}

			if(data.event === 'typingList') {
				setTypingList(data.typingList)
				return;
			}
			setMessages((prev) => [...prev, JSON.parse(event.data)]);
		};

		ws.onclose = (event) => {
			setUsername(undefined);
			setAuthenticated(false);
		};

		return () => {
			if (
				ws.readyState === WebSocket.OPEN ||
				ws.readyState === WebSocket.CONNECTING
			) {
				ws.close();
			}
		};
	}, [username]);

	const startTyping = () => {
		if(isTyping === true) return;
		if (!username || !socket || socket.readyState !== WebSocket.OPEN) return;
		socket?.send(JSON.stringify({ event: 'startTyping', username: username }));
		setIsTyping(true);
	};

	const stopTyping = () => {
		if(isTyping === false) return;
		if (!username || !socket || socket.readyState !== WebSocket.OPEN) return
		socket?.send(JSON.stringify({ event:'stopTyping', username: username }))
		setIsTyping(false);
	};

	const sendMessage = async (message: string) => {
		await fetch("http://26.19.71.60:3333/message/create", {
			method: "POST",
			body: JSON.stringify({
				author: username,
				content: message,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		void 0;
	};

	return {
		messages,
		sendMessage,
		username,
		setUsername,
		authenticated,
		startTyping,
		typingList,
		stopTyping
	};
}
