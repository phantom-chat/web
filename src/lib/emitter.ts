import type { User } from "@/contexts/auth";
import type { Message } from "@/hooks/use-chat";
import { EventEmitter } from "node:events";

// {

//     "event": "messageFetch"
// }

type HandshakeEvent = {
	event: "handshake";
	status: "success" | "failed";
};

type UsersFetchEvent = {
	event: "usersFetch";
	users: User[];
};

type MessageFetchEvent = {
	event: "messageFetch";
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

type MessageDeleteEvent = {
	event: "usersFetch";
	id: number;
};

type MessageCreateEvent = Message;

interface Events {
	handshake: ({ event, status }: HandshakeEvent) => void;
	usersFetch: ({ users }: UsersFetchEvent) => void;
	messagesFetch: ({ messages }: MessageFetchEvent) => void;
	messageCreate: (message: MessageCreateEvent) => void;
	messageDelete: ({ id }: MessageDeleteEvent) => void;
}

export class Emitter extends EventEmitter {
	on<K extends keyof Events>(event: K, listener: Events[K]): this {
		return super.on(event, listener);
	}
	emit<K extends keyof Events>(
		event: K,
		...args: Parameters<Events[K]>
	): boolean {
		return super.emit(event, ...args);
	}
}

export const emitter = new Emitter();
