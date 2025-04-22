import type { Events } from "@/contexts/chat/types";

export type Message = {
	event: Events.MESSAGE_CREATE;
	id: string;
	author: {
		id: string;
		username: string;
		createdAt: string;
		bot: boolean;
	};
	content: string;
	createdAt: string;
};
