import { Message } from "@/types/message";
import { CurrentGroup, Events, GroupedMessage } from "./types";

export const MESSAGE_GROUPING_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

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