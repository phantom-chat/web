import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDelete, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ContextMenuItem } from "@/components/ui/context-menu";

import { Trash } from "lucide-react";
import { MouseEventHandler } from "react";

type DeleteMessageInteractionType = {
    modalOpen: boolean
    setModalOpen: (open: boolean) => void
    handleDelete: (id: string) => Promise<void>
    onClick?: MouseEventHandler<HTMLDivElement> | undefined
    onClickDelete?: MouseEventHandler<HTMLButtonElement> | undefined
    id: string
    mobile?: boolean
}

export const DeleteMessageInteraction = ({ modalOpen, setModalOpen, onClickDelete, handleDelete, onClick, id, mobile = false }: DeleteMessageInteractionType) => {
    if (mobile) return (
        <AlertDialog open={modalOpen}>
            <AlertDialogTrigger asChild>
                <Button onClick={(e) => {
                    e.preventDefault();
                    setModalOpen(true);
                }}
                    variant="destructive" size="lg" className="text-sm w-full justify-between">
                    Delete message
                    <Trash className="size-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-lg h-fit">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg">Are you absolutely sure?</AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you absolutely sure you want to delete this message?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setModalOpen(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogDelete onClick={onClickDelete}>Delete</AlertDialogDelete>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
    return (
        <>
            <div className="hidden lg:flex">
                <AlertDialog open={modalOpen}>
                    <AlertDialogTrigger asChild>
                        <ContextMenuItem
                            variant="destructive"
                            className="text-sm"
                            onClick={onClick}
                        >
                            Delete message
                            <Trash className="size-3" />
                        </ContextMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-lg h-48">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg">Are you absolutely sure?</AlertDialogTitle>

                            <AlertDialogDescription>
                                Are you absolutely sure you want to delete this message?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="items-end">
                            <AlertDialogCancel onClick={() => setModalOpen(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogDelete onClick={() => handleDelete(id)}>Delete</AlertDialogDelete>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    )
}