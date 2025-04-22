import { API_ENDPOINTS } from "@/config/api";
import { type Status, type User, useAuth } from "@/contexts/auth";
import {
    emitter,
} from "@/lib/emitter";
import { formatMessage } from "@/lib/format-message";
import { HandshakeEvent, MessageCreateEvent, MessageDeleteEvent, MessagesFetchEvent, UsersFetchEvent, UserUpdateEvent } from "@/types/events";
import type { Message } from "@/types/message";
import cookies from "js-cookie";
import { redirect } from "next/navigation";
import {
    type PropsWithChildren,
    createContext,
    use,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { toast } from "sonner";

export enum Events {
    MESSAGE_CREATE = "messageCreate",
    MESSAGE_DELETE = "messageDelete",
    USERS_FETCH = "usersFetch",
    MESSAGE_FETCH = "messagesFetch",
    HANDSHAKE = "handshake",
    USER_UPDATE = "userUpdate",
}

type Author = {
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

const MESSAGE_GROUPING_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

type CurrentGroup = {
    author: Author | null;
    messages: {
        id: string;
        content: string;
        createdAt: number;
    }[];
}

export function groupMessages(messages: Message[]): GroupedMessage[] {
    const groups: GroupedMessage[] = [];
    let current: CurrentGroup = { author: null, messages: [] };
    const filteredMessages = messages.filter((msg) => msg.event === Events.MESSAGE_CREATE);

    for (const message of filteredMessages) {
        const time = new Date(message.createdAt).getTime();

        if (
            !current.author ||
            message.author.id !== current.author.id ||
            (current.messages.length &&
                time - (current.messages.at(-1)?.createdAt ?? 0) > MESSAGE_GROUPING_TIMEOUT)
        ) {
            if (current.author) {
                groups.push({
                    type: "messageEvent",
                    author: current.author,
                    messages: current.messages,
                });
            }

            current = { author: message.author, messages: [] };
        }

        current.messages.push({
            id: message.id,
            content: message.content,
            createdAt: time,
        });
    }

    if (current.author) {
        groups.push({
            type: "messageEvent",
            author: current.author,
            messages: current.messages,
        });
    }
    return groups;
}

type ChatContextType = {
    messages: Message[];
    sendMessage: (content: string) => Promise<void>;
    changeStatus: (status: Status) => Promise<void>;
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
    const socket = useRef<WebSocket>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [socketAuthenticated, setSocketAuthenticated] =
        useState<boolean>(false);

    useEffect(() => {
        const userStatus = users.find(
            (u) => Number(u.id) === Number(user?.id),
        )?.status
        setUser((prev) => {
            if (!prev) return null;
            if (!userStatus) return prev;
            return {
                ...prev,
                status: userStatus as Status,
            };
        });
    }, [users]);

    useEffect(() => {
        if (!user) return;
        if (!isAuthenticated) return;
        const ws = new WebSocket("ws://100.94.141.111:3333/chat");
        socket.current = ws;
        ws.onopen = () => {
            setMessages([]);
            const handshakeMessage = {
                event: "handshake",
                type: "request",
                token: cookies.get("phantom-token"),
                timestamp: Date.now(),
            };
            ws.send(JSON.stringify(handshakeMessage));
        };

        ws.onclose = () => {
            toast.error("Connection lost. Try again later.");
            setSocketAuthenticated(false);
        };

        emitter.on("handshake", (data) => {
            if (data.status === "success") {
                toast.success("You are logged in.");
                return setSocketAuthenticated(true);
            }
            toast.error("Authentication failed. Try again later.");
            return setSocketAuthenticated(false);
        });

        emitter.on('userUpdate', ({ user }) => {
            setUsers(prevUsers => {
                return prevUsers.map(prevUser => {
                    if (prevUser.id === user.id) {
                        return { ...prevUser, status: user.status };
                    }
                    return prevUser;
                });
            });
        })

        emitter.on("usersFetch", ({ users }) => {
            setUsers(users);
        });

        emitter.on("messagesFetch", ({ messages }) => {
            setMessages((prev) => [...formatMessage(messages), ...prev]);
        });

        emitter.on("messageCreate", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        emitter.on("messageDelete", ({ id }) => {
            setMessages((prev) => prev.filter((msg) => msg.id !== String(id)));
        });

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data) as MessagePayload;

            switch (data.event) {
                case Events.HANDSHAKE:
                    emitter.emit("handshake", data as HandshakeEvent);
                    break;
                case Events.MESSAGE_FETCH:
                    emitter.emit("messagesFetch", data as MessagesFetchEvent);
                    break;
                case Events.USERS_FETCH:
                    emitter.emit("usersFetch", data as UsersFetchEvent);
                    break;
                case Events.MESSAGE_CREATE:
                    emitter.emit("messageCreate", data as MessageCreateEvent);
                    break;
                case Events.MESSAGE_DELETE:
                    emitter.emit("messageDelete", data as MessageDeleteEvent);
                    break;
                case Events.USER_UPDATE:
                    emitter.emit("userUpdate", data as UserUpdateEvent);
                    break;
            }
        };

        return () => {
            if (
                socket.current &&
                (socket.current.readyState === WebSocket.OPEN ||
                    socket.current.readyState === WebSocket.CONNECTING)
            ) {
                socket.current.close();
            }
        };
    }, [isAuthenticated]);

    const deleteMessage = async (id: string) => {
        const res = await fetch(API_ENDPOINTS.DELETE_MESSAGE, {
            method: "DELETE",
            body: JSON.stringify({
                id: Number(id),
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + cookies.get("phantom-token"),
            },
        });

        if (res.status !== 200) {
            toast.error("You are not logged in.");
            cookies.remove("phantom-token");
            socket.current?.close();
            redirect("/login");
        }
    };

    const sendMessage = async (message: string) => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            return;
        }

        const res = await fetch(API_ENDPOINTS.CREATE_MESSAGE, {
            method: "POST",
            body: JSON.stringify({
                content: trimmedMessage,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + cookies.get("phantom-token"),
            },
        });
        if (res.status !== 200) {
            toast.error("You are not logged in.");
            cookies.remove("phantom-token");
            socket.current?.close();
            redirect("/login");
        }
    };

    const changeStatus = async (status: Status) => {

        const res = await fetch(API_ENDPOINTS.UPDATE_USER, {
            method: "PATCH",
            body: JSON.stringify({
                status: status,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + cookies.get("phantom-token"),
            },
        });

        const json = await res.json();
    }

    return (
        <ChatContext.Provider
            value={{
                changeStatus,
                sendMessage,
                messages,
                socketAuthenticated,
                users,
                groupedMessages,
                deleteMessage,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export function useChat() {
    const context = use(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}
