'use client'
import { useAuth } from "@/contexts/auth";
import { useChat } from "@/contexts/chat";
import useLongPress from "@/hooks/use-long-press";
import { useState } from "react";

import { CopyMessageInteraction } from "./chat/messages/interactions/copy";
import { DeleteMessageInteraction } from "./chat/messages/interactions/delete";
import { EditMessageInteraction } from "./chat/messages/interactions/edit";
import {
  ContextMenu,
  ContextMenuContent, ContextMenuSeparator,
  ContextMenuTrigger
} from "./ui/context-menu";
import { Drawer, DrawerContent, DrawerTitle } from "./ui/drawer";

type MessageProps = {
  id: string;
  content: string;
  createdAt: number;
  authorId: string;
};

export const Message = ({ content, createdAt, id, authorId }: MessageProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();
  const { deleteMessage } = useChat();
  const backspaceLongPress = useLongPress(() => setDrawerOpen(true), 500);

  const handleCopy = () => {
    navigator.clipboard?.writeText(content);
  };


  const handleDelete = async (id: string) => {
    deleteMessage(id)
    setDeleteOpen(false)
  };

  const isAuthor = user?.id === authorId;
  return (
    <>
      <div className="block lg:hidden">
        <div {...backspaceLongPress} className="flex items-center border border-transparent justify-between py-0.5 px-2 w-full transition hover:text-muted-foreground">
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent className="">
            <DrawerTitle className="hidden">Are you absolutely sure?</DrawerTitle>
            <div className="flex px-4 py-8 flex-col gap-3">

              <CopyMessageInteraction mobile onClick={() => { handleCopy(); setDrawerOpen(false) }} />
              <EditMessageInteraction mobile isAuthor={isAuthor} />
              <DeleteMessageInteraction
                mobile
                modalOpen={deleteOpen}
                handleDelete={handleDelete}
                id={id}
                onClick={(e) => {
                  e.preventDefault();
                  if (e.shiftKey) {
                    handleDelete(id);
                  } else {
                    setDeleteOpen(true);
                  }
                }}
                setModalOpen={setDeleteOpen}
                onClickDelete={() => { handleDelete(id); setDrawerOpen(false) }}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="hidden lg:block">
        <ContextMenu modal={false}>
          <ContextMenuTrigger>
            <div className="flex items-center border border-transparent justify-between py-0.5 px-2 w-full transition hover:text-muted-foreground">
              <p className="whitespace-pre-wrap break-words">{content}</p>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="min-w-[160px]">
            <CopyMessageInteraction onClick={() => handleCopy} />
            <EditMessageInteraction isAuthor={isAuthor} />

            {isAuthor && (<ContextMenuSeparator />)}
            <DeleteMessageInteraction
              modalOpen={deleteOpen}
              handleDelete={handleDelete}
              id={id}
              onClick={(e) => {
                e.preventDefault();
                if (e.shiftKey) {
                  handleDelete(id);
                } else {
                  setDeleteOpen(true);
                }
              }}
              setModalOpen={setDeleteOpen}
            />
          </ContextMenuContent>
        </ContextMenu>
      </div>

    </>
  );
};
