import type { Message } from "@/types/message";

export type RawMessage = {
	id: number;
	content: string;
	createdAt: string;
	updatedAt: string | null;
	author: {
		id: number;
		username: string;
		createdAt: string;
		bot: boolean;
	};
};

export const formatMessage = (messages: RawMessage[]): Message[] => {
	const formattedMessages = messages.map((msg: RawMessage) => ({
		event: "messageCreate",
		id: String(msg.id),
		author: {
			id: String(msg.author.id),
			username: msg.author.username,
			createdAt: msg.author.createdAt,
			bot: Boolean(msg.author.bot),
		},
		content: msg.content,
		createdAt: msg.createdAt,
	})) as Message[];

	return formattedMessages;
};
