import { type Message, groupMessages } from "@/hooks/use-chat";
import { formatTime } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";

type MessagesProps = {
  messages: Message[];
  username: string;
};

export function Messages({ messages, username }: MessagesProps) {
  return groupMessages(messages).map((message, index) => {
    if (message.type === "memberEvent") {
      if (message.user === undefined) return;
      return (
        <div
          className="w-full flex items-center justify-center text-sm animate-in fade-in slide-in-from-bottom-4 duration-300"
          key={index}
        >
          <p>
            <b>@{message.user}</b>{" "}
            {message.action === "add" ? "joined" : "left"} the chat
          </p>
        </div>
      );
    }

    const isMe = username === message.author;

    return (
      <div className="w-full flex flex-col gap-1 relative animate-in fade-in slide-in-from-bottom-4 duration-300" key={index}>
        {!isMe && (
          <p className="font-bold text-muted-foreground text-sm gap-1 inline-flex items-center">
            {message.bot && <Bot className="size-4" />}@{message.author}
          </p>
        )}

        <div
          className={cn(
            "w-fit flex flex-col border p-2.5 text-sm min-w-1/12 bg-secondary rounded-lg gap-2 max-w-11/12 break-words",
            isMe ? "bg-secondary/50 border-border/50" : "",
          )}
        >
          <div className="flex flex-col gap-1.5">
            {message.messages.map((msg, i) => {
              return <p key={i}>{msg.content}</p>;
            })}
          </div>
        </div>

        <span
          className={cn(
            "text-muted-foreground/80 text-xs",
            isMe ? "mr-auto" : "mr-auto",
          )}
        >
          {formatTime(message.messages[0].timestamp)}
        </span>
      </div>
    );
  });
}
