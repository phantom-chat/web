import type { User } from "@/contexts/auth";
import type { Events } from "@/contexts/chat";
import type { Message } from "./message";

export type HandshakeEvent = {
	event: Events.HANDSHAKE;
	status: "success" | "failed";
};

export type UsersFetchEvent = {
	event: Events.USERS_FETCH;
	users: User[];
};

export type UserUpdateEvent = {
	event: Events.USER_UPDATE;
	user: User;
};

export type MessagesFetchEvent = {
	event: Events.MESSAGE_FETCH;
	messages: {
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
	}[];
};

export type MessageDeleteEvent = {
	event: Events.MESSAGE_DELETE;
	id: number;
};

export type MessageCreateEvent = Message;
