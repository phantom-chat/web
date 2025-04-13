
import { Button } from "@/components/ui/button";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { Clipboard } from "lucide-react";

type CopyMessageInteractionType = {
    onClick: () => void
    mobile?: boolean
}

export const CopyContentMessageInteraction = ({ onClick, mobile = false }: CopyMessageInteractionType) => {
    if (mobile) return (
        <Button onClick={onClick} variant="secondary" size="lg" className="text-sm w-full justify-between lg:hidden inline-flex">
            Copy text
            <Clipboard className="size-4" />
        </Button>
    )
    return (
        <ContextMenuItem onClick={onClick} className="text-sm hidden lg:flex">
            Copy text
            <Clipboard className="size-3" />
        </ContextMenuItem>
    )
}