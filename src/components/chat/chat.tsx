import { useAuth } from "@/contexts/auth";
import { useChat } from "@/contexts/chat";
import { useMergedRef } from "@/hooks/use-merged-ref";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Messages } from "../messages";
import { Input } from "./input";

export const Chat = () => {
    const { user } = useAuth();
    const {
        messages,
    } = useChat();

    const { ref, inView } = useInView();
    const endRef = useRef<HTMLDivElement>(null);
    const mergedEndRefs = useMergedRef(ref, endRef);

    useEffect(() => {
        const message = messages.at(-1);
        const isOwnMessage =
            message?.event === "messageCreate" && message.author.id === user?.id;

        if (inView || isOwnMessage) {
            endRef.current?.scrollIntoView({ behavior: "instant" });
        }
    }, [messages]);
    return (
        <div className="w-full border-x flex-grow max-w-2xl flex flex-col h-screen">
            <div className="flex-1 w-full overflow-y-auto">
                <div className="flex flex-col items-start justify-end min-h-full pt-6 px-2 gap-4">
                    <Messages />
                    <div ref={mergedEndRefs} />
                </div>
            </div>
            <div className="px-2">
                <Input />
            </div>
        </div>
    )
}
{/* <div className="w-full border-x flex-grow max-w-2xl mt-auto justify-end flex flex-col pt-4 h-screen px-2">
        <ScrollArea>
            <div className="flex-1 w-full h-full flex flex-col items-start justify-end pt-4 px-px gap-4">
                <Messages />
                <div ref={mergedEndRefs} />
            </div>
        </ScrollArea>
        <Input />
    </div> */}