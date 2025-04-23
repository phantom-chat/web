import { Status, User } from "@/features/auth/context";
import { HandshakeEvent, MessageCreateEvent, MessageDeleteEvent, MessagesFetchEvent, UsersFetchEvent, UserUpdateEvent } from "@/shared/types/events";
import { Message } from "@/shared/types/message";

export enum Events {
    MESSAGE_CREATE = "messageCreate",
    MESSAGE_DELETE = "messageDelete",
    USERS_FETCH = "usersFetch",
    MESSAGE_FETCH = "messagesFetch",
    HANDSHAKE = "handshake",
    USER_UPDATE = "userUpdate",
}

export type Author = {
    id: string;
    username: string;
    createdAt: string;
    bot: boolean;
};

export type MessagePayload =
    | HandshakeEvent
    | MessagesFetchEvent
    | UsersFetchEvent
    | MessageCreateEvent
    | MessageDeleteEvent
    | UserUpdateEvent

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
};

export type CurrentGroup = {
    author: Author | null;
    messages: {
        id: string;
        content: string;
        createdAt: number;
    }[];
}

export type ChatContextType = {
    messages: Message[];
    sendMessage: (content: string) => Promise<void>;
    changeStatus: (status: Status) => Promise<void>;
    deleteMessage: (id: string) => Promise<void>;
    users: User[];
    socketAuthenticated: boolean;
    groupedMessages: GroupedMessage[];
};
