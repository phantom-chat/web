import type {
	HandshakeEvent,
	MessageCreateEvent,
	MessageDeleteEvent,
	MessagesFetchEvent,
	UsersFetchEvent,
	UserUpdateEvent,
} from "@/types/events";
import { EventEmitter } from "events";

interface TEvents {
	handshake: ({ event, status }: HandshakeEvent) => void;
	userUpdate: ({ user }: UserUpdateEvent) => void;
	usersFetch: ({ users }: UsersFetchEvent) => void;
	messagesFetch: ({ messages }: MessagesFetchEvent) => void;
	messageCreate: ({ ...message }: MessageCreateEvent) => void;
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
