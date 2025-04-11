// import { GroupedMessage, groupMessages, Message, TypingPayload } from "@/hooks/use-chat";
import { type User, useAuth } from "@/contexts/auth";
import { emitter } from "@/lib/emitter";
import { default as cookie } from "js-cookie";
import { createContext, PropsWithChildren, use, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Author = {
    id: string;
    username: string;
    createdAt: string;
    bot: boolean;
};

export type Message = {
    event: "messageCreate";
    id: string;
    author: {
        id: string;
        username: string;
        createdAt: string;
        bot: boolean;
    };
    content: string;
    createdAt: string;
}

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
}


export function groupMessages(messages: Message[]): GroupedMessage[] {
    const result: GroupedMessage[] = [];
    let currentAuthor: Author | null = null;
    let currentMessages: {
        id: string;
        content: string;
        createdAt: number;
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
                id: message.id,
                content: message.content,
                createdAt: Number(new Date(message.createdAt)),
            });
        }
    }

    flushCurrentMessages();
    return result;
}
type ChatContextType = {
    messages: Message[];
    sendMessage: (content: string) => Promise<void>;
    deleteMessage: (id: string) => Promise<void>;
    users: User[];
    socketAuthenticated: boolean;
    groupedMessages: GroupedMessage[];
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: PropsWithChildren) => {
    const { isAuthenticated, user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const groupedMessages = useMemo(() => groupMessages(messages), [messages]);

    const [_, setSocket] = useState<WebSocket | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [socketAuthenticated, setSocketAuthenticated] =
        useState<boolean>(false);


    useEffect(() => {
        if (!user) return;
        if (!isAuthenticated) return;
        const ws = new WebSocket("ws://100.94.141.111:3333/chat");
        setSocket(ws);
        ws.onopen = () => {
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

            switch (data.event) {
                case "handshake":
                    emitter.emit("handshake", data);
                    break;
                case "messagesFetch":
                    emitter.emit("messagesFetch", data);
                    break;
                case "usersFetch":
                    emitter.emit("usersFetch", data);
                    break;
                case "messageCreate":
                    emitter.emit("messageCreate", data);
                    break;
                case "messageDelete":
                    emitter.emit("messageDelete", data);
                    break;
            }
        };

        ws.onclose = () => {
            toast.error("connection lost. Try again later.");
            setSocketAuthenticated(false);
        };

        emitter.on("handshake", (data) => {
            if (data.status === "success") {
                // toast.error("You are logged in.");
                toast.success("you are logged in.");
                setSocketAuthenticated(true);
            } else {
                toast.error("authentication failed. try again later.");
                setSocketAuthenticated(false);
            }
        });

        emitter.on("usersFetch", ({ users }) => {
            setUsers(users);
        });

        emitter.on("messagesFetch", ({ messages }) => {
            const formattedMessages = messages.map((msg: any) => ({
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

            setMessages((prevMessages) => [...formattedMessages, ...prevMessages]);
        });

        emitter.on("messageCreate", (message) => {
            setMessages((prev) => {
                return [...prev, message];
            });
        });

        emitter.on("messageDelete", ({ id }) => {
            setMessages((prev) => {
                return prev.filter((msg) => msg.id !== String(id));
            });
        });

        return () => {
            if (
                ws.readyState === WebSocket.OPEN ||
                ws.readyState === WebSocket.CONNECTING
            ) {
                ws.close();
            }
        };
    }, [user?.username]);

    const deleteMessage = async (id: string) => {
        await fetch("http://100.94.141.111:3333/messages/delete", {
            method: "DELETE",
            body: JSON.stringify({
                id: Number(id),
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + cookie.get("phantom-token"),
            },
        });
        void 0;
    };

    const sendMessage = async (message: string) => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            return;
        }

        await fetch("http://100.94.141.111:3333/messages/create", {
            method: "POST",
            body: JSON.stringify({
                content: trimmedMessage,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + cookie.get("phantom-token"),
            },
        });
        void 0;
    };
    return (

        <ChatContext value={{
            sendMessage,
            messages,
            socketAuthenticated,
            users,
            groupedMessages,
            deleteMessage
        }}>
            {children}
        </ChatContext>
    )
}

export function useChat() {
    const context = use(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}