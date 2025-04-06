"use client";
import { ChatInput } from "@/components/chat-input";
import { JoinChatCard } from "@/components/join-chat";
import { Messages } from "@/components/messages";
import { useChat } from "@/hooks/use-chat";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { useInView } from 'react-intersection-observer'

export default function Home() {
  const {
    messages,
    sendMessage,
    authenticated,
    username,
    setUsername,
    startTyping,
    stopTyping,
    typingList,
  } = useChat();
  const { ref, inView } = useInView()
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!inView) return
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!authenticated || !username)
    return <JoinChatCard setUsername={setUsername} />;

  return (
    <div className="items-center justify-center min-h-screen h-full flex font-mono">
      <div className="w-full flex-grow max-w-lg mt-auto h-full flex flex-col pt-4">
        <ScrollArea>
          <div className="flex-1 w-full h-full flex flex-col items-start justify-end pt-4 px-px gap-4">
            <Messages messages={messages} username={username} />
            <div ref={ref} />
            <div ref={endRef} />
          </div>
        </ScrollArea>
        <ChatInput
          sendMessage={sendMessage}
          username={username}
          startTyping={startTyping}
          stopTyping={stopTyping}
          typingList={typingList}
        />
      </div>
    </div>
  );
}
