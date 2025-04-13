import { Button } from "@/components/ui/button";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { Reply } from "lucide-react";

export const ReplyMessageInteraction = ({ mobile = false }: { mobile?: boolean }) => {

    if (mobile) return (
        <Button disabled variant="secondary" size="lg" className="text-sm w-full justify-between">
            Reply
            <Reply className="size-4" />
        </Button>
    )
    return (
        <>
            <ContextMenuItem disabled className="text-sm hidden lg:flex">
                Reply
                <Reply className="size-3" />
            </ContextMenuItem>
        </>
    )
}