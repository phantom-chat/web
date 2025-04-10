import { useAuth } from "@/contexts/auth";
import type { TypingPayload } from "@/hooks/use-chat";
import { Send, Smile } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "./ui/emoji-picker";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type ChatInputProps = {
  sendMessage: (message: string) => Promise<void>;
  startTyping: () => void;
  stopTyping: () => void;
  typingList: TypingPayload[];
};

export const ChatInput = ({
  sendMessage,
  startTyping,
  stopTyping,
  typingList,
}: ChatInputProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const message = formData.get("message") as string;

    setMessage("");

    stopTyping();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    await sendMessage(message);
  };

  const handleTyping = () => {
    startTyping();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="sticky bottom-0">
      <form
        onSubmit={handleSend}
        className="flex relative bg-gradient-to-b from-transparent to-25% to-background bottom-0 py-4 z-20 flex-row w-full items-center justify-between gap-2"
      >
        {typingList.length !== 0 && (
          <p className="text-xs absolute -top-2.5 inline-flex items-center justify-center gap-2">
            {typingList.map((c) => c.username).join(", ")} is typing...
          </p>
        )}
        <Input
          ref={inputRef}
          autoFocus
          onInput={handleTyping}
          name="message"
          className="w-full"
          placeholder={`message #chat as @${user?.username}`}
          value={message || ""}
          onChange={(e) => setMessage(e.currentTarget.value)}
          autoComplete="off"
          maxLength={5000}
        />
        <Popover onOpenChange={setIsOpen} open={isOpen}>
          <PopoverTrigger asChild>
            <Button size="icon" variant="secondary">
              <Smile />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-fit p-0">
            <EmojiPicker
              className="h-[360px] font-mono"
              onEmojiSelect={({ emoji }: { emoji: string }) => {
                setMessage((prev) => {
                  // if (!prev) return emoji;
                  if (!inputRef.current) return prev + emoji;
                  const cursorPosition =
                    inputRef.current.selectionStart ?? prev!.length;
                  setIsOpen(false);
                  return (
                    prev!.slice(0, cursorPosition) +
                    emoji +
                    prev!.slice(cursorPosition)
                  );
                });
                inputRef!.current!.focus();
              }}
            >
              <EmojiPickerSearch />
              <EmojiPickerContent />
              <EmojiPickerFooter />
            </EmojiPicker>
          </PopoverContent>
        </Popover>
        <Button type="submit" disabled={!message} size="icon">
          <Send />
        </Button>
      </form>
    </div>
  );
};
