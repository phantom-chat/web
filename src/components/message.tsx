import { useAuth } from "@/contexts/auth";
import { useChat } from "@/contexts/chat";
import cookie from "js-cookie";
import { Clipboard, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from "./ui/context-menu";

type MessageProps = {
  id: string;
  content: string;
  createdAt: number;
  authorId: string;
};

export const Message = ({ content, createdAt, id, authorId }: MessageProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { user } = useAuth();
  const { deleteMessage } = useChat();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };


  const handleDelete = async (id: string) => {
    deleteMessage(id)
    setDeleteOpen(false)
  };

  const isAuthor = user?.id === authorId;
  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger>
        <div className="flex items-center border border-transparent justify-between py-0.5 px-2 w-full hover:text-muted-foreground">
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-[160px]">
        <ContextMenuItem onClick={handleCopy} className="text-sm">
          copy text
          <Clipboard className="size-3" />
        </ContextMenuItem>

        {isAuthor && (
          <>
            <ContextMenuItem disabled className="text-sm">
              edit message
              <Pencil className="size-3" />
            </ContextMenuItem>
            <ContextMenuSeparator />

            <AlertDialog open={deleteOpen}  >
              <AlertDialogTrigger asChild>

                <ContextMenuItem variant="destructive" className="text-sm" onClick={(e) => { e.preventDefault(); setDeleteOpen(true) }}>
                  delete message
                  <Trash className="size-3" />
                </ContextMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    once you delete this message, it's gone forever. there's no
                    going back, so be sure!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteOpen(false)}>cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(id)} className="bg-red-500 text-red-50 hover:bg-red-500 hover:opacity-75">delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>

            </AlertDialog>
          </>
        )}

      </ContextMenuContent>
    </ContextMenu>

  );
};
