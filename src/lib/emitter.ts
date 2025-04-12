import type { User } from "@/contexts/auth";
import { Events } from "@/contexts/chat";
import { Message } from "@/types/message";
import { EventEmitter } from "node:events";


export type HandshakeEvent = {
	event: Events.HANDSHAKE;
	status: "success" | "failed";
};

export type UsersFetchEvent = {
	event: Events.USERS_FETCH;
	users: User[];
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

interface TEvents {
	handshake: ({ event, status }: HandshakeEvent) => void;
	usersFetch: ({ users }: UsersFetchEvent) => void;
	messagesFetch: ({ messages }: MessagesFetchEvent) => void;
	messageCreate: (message: MessageCreateEvent) => void;
	messageDelete: ({ id }: MessageDeleteEvent) => void;
}

export class Emitter extends EventEmitter {
	on<K extends keyof TEvents>(event: K, listener: TEvents[K]): this {
		return super.on(event, listener);
	}
	emit<K extends keyof TEvents>(
		event: K,
		...args: Parameters<TEvents[K]>
	): boolean {
		return super.emit(event, ...args);
	}
}

export const emitter = new Emitter();
