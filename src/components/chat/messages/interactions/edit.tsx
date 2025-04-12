import { Button } from "@/components/ui/button";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { Pencil } from "lucide-react";

export const EditMessageInteraction = ({ isAuthor, mobile = false }: { isAuthor: boolean, mobile?: boolean }) => {
    if (!isAuthor) return;

    if (mobile) return (
        <Button disabled variant="secondary" size="lg" className="text-sm w-full justify-between">
            Edit message
            <Pencil className="size-4" />
        </Button>
    )
    return (
        <>
            <ContextMenuItem disabled className="text-sm hidden lg:flex">
                Edit message
                <Pencil className="size-3" />
            </ContextMenuItem>
        </>
    )
}