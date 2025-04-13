
import { Button } from "@/components/ui/button";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { Clipboard, IdCard } from "lucide-react";

type CopyMessageInteractionType = {
    onClick: () => void
    mobile?: boolean
}

export const CopyIdMessageInteraction = ({ onClick, mobile = false }: CopyMessageInteractionType) => {
    if (mobile) return (
        <Button onClick={onClick} variant="secondary" size="lg" className="text-sm w-full justify-between lg:hidden inline-flex">
            Copy Message ID
            <IdCard className="size-4" />
        </Button>
    )
    return (
        <ContextMenuItem onClick={onClick} className="text-sm hidden lg:flex">
            Copy Message ID
            <IdCard className="size-3" />
        </ContextMenuItem>
    )
}