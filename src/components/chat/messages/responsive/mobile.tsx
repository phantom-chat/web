import { ContextMenuSeparator } from "@/components/ui/context-menu";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useAuth } from "@/contexts/auth";
import { useChat } from "@/contexts/chat";
import useLongPress from "@/hooks/use-long-press";
import { useState } from "react";
import { CopyContentMessageInteraction } from "../interactions/copy-content";
import { CopyIdMessageInteraction } from "../interactions/copy-id";
import { DeleteMessageInteraction } from "../interactions/delete";
import { EditMessageInteraction } from "../interactions/edit";
import { ReplyMessageInteraction } from "../interactions/reply";
import { MessageProps } from "../message";

export const MobileMessage = ({ content, createdAt, id, authorId }: MessageProps) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);

    const { deleteMessage } = useChat();
    const { user } = useAuth();
    const isAuthor = user?.id === authorId;
    const backspaceLongPress = useLongPress(() => setDrawerOpen(true), 500);


    const handleCopyContent = () => {
        navigator.clipboard?.writeText(content);
    };

    const handleCopyId = () => {
        navigator.clipboard?.writeText(String(id));
    };

    const handleDelete = async (id: string) => {
        deleteMessage(id)
        setAlertDialogOpen(false)
    };

    return (
        <div className="block lg:hidden">
            <div {...backspaceLongPress} className="flex items-center border border-transparent justify-between py-0.5 px-2 w-full transition hover:text-muted-foreground">
                <p className="whitespace-pre-wrap break-words">{content}</p>
            </div>
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerContent className="">
                    <DrawerTitle className="hidden">Are you absolutely sure?</DrawerTitle>
                    <div className="flex px-4 py-8 flex-col gap-3">

                        <EditMessageInteraction mobile isAuthor={isAuthor} />
                        <ReplyMessageInteraction mobile />
                        <ContextMenuSeparator />
                        <CopyContentMessageInteraction mobile onClick={() => { handleCopyContent(); setDrawerOpen(false) }} />

                        {isAuthor && (<ContextMenuSeparator />)}
                        <DeleteMessageInteraction
                            mobile
                            modalOpen={alertDialogOpen}
                            handleDelete={handleDelete}
                            id={id}
                            onClick={(e) => {
                                e.preventDefault();
                                if (e.shiftKey) {
                                    handleDelete(id);
                                } else {
                                    setAlertDialogOpen(true);
                                }
                            }}
                            setModalOpen={setAlertDialogOpen}
                            onClickDelete={() => { handleDelete(id); setDrawerOpen(false) }}
                        />

                        <ContextMenuSeparator />
                        <CopyIdMessageInteraction mobile onClick={() => { handleCopyId(); setDrawerOpen(false) }} />
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}