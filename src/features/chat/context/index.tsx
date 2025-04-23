import { API_ENDPOINTS } from "@/config/api";
import { type Status, type User, useAuth } from "@/features/auth/context";
import { ChatService } from "@/features/chat/services/chat";
import { apiService } from "@/shared/services/api";
import type { Message } from "@/shared/types/message";
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
import { MessageManager } from "./managers/message-manager";
import { UserManager } from "./managers/user-manager";
import { WebSocketManager } from "./managers/websocket-manager";
import { ChatContextType } from "./types";
import { groupMessages } from "./utils";


const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: PropsWithChildren) => {
    const { isAuthenticated, user, setUser } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [socketAuthenticated, setSocketAuthenticated] =
        useState<boolean>(false);
    const groupedMessages = useMemo(() => groupMessages(messages), [messages]);
    const messageManager = useMemo(() => new MessageManager(setMessages), []);
    const userManager = useMemo(() => new UserManager(setUsers), []);
    const socketManager = useMemo(
        () => new WebSocketManager(messageManager, userManager, setSocketAuthenticated),
        [messageManager, userManager]
    );

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
        if (!user || !isAuthenticated) return;
        socketManager.connect();
        return () => socketManager.disconnect();
    }, [isAuthenticated])



    const deleteMessage = async (id: string) => {
        try {
            await ChatService.deleteMessage(id);
        } catch {
            ChatService.handleAuthError();
        }
    };

    const sendMessage = async (message: string) => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage) return;

        try {
            await ChatService.sendMessage(trimmedMessage);
        } catch {
            ChatService.handleAuthError();
        }
    };

    const changeStatus = async (status: Status) => {
        try {
            await ChatService.updateStatus(status);
        } catch {
            ChatService.handleAuthError();
        }
    };

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
