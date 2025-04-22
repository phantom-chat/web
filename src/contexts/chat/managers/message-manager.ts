import { formatMessage, RawMessage } from "@/lib/format-message";
import { Message } from "@/types/message";
import { Dispatch, SetStateAction } from "react";

export class MessageManager {
    private messages: Message[] = [];
    private setMessages: Dispatch<SetStateAction<Message[]>>;

    constructor(setMessages: Dispatch<SetStateAction<Message[]>>) {
        this.setMessages = setMessages;
    }

    add(message: Message) {
        this.setMessages(prev => [...prev, message]);
    }

    remove(id: number) {
        this.setMessages(prev => prev.filter(msg => msg.id !== String(id)));
    }

    load(messages: RawMessage[]) {
        this.setMessages((prev) => [...formatMessage(messages), ...prev]);
    }

    clear() {
        this.setMessages([]);
    }

    getAll() {
        return this.messages;
    }
}