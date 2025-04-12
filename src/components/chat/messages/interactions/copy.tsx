
import { Button } from "@/components/ui/button";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { Clipboard } from "lucide-react";

type CopyMessageInteractionType = {
    onClick: () => void
    mobile?: boolean
}

export const CopyMessageInteraction = ({ onClick, mobile = false }: CopyMessageInteractionType) => {
    if (mobile) return (
        <Button onClick={onClick} variant="secondary" size="lg" className="text-sm w-full justify-between lg:hidden inline-flex">
            Copy text
            <Clipboard className="size-4" />
        </Button>
    )
    return (
        // <>
        // <button className="border focus:bg-accent justify-between focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
        //     Copy text
        //     <Clipboard className="size-3" />
        // </button>
        <ContextMenuItem onClick={onClick} className="text-sm hidden lg:flex">
            Copy text
            <Clipboard className="size-3" />
        </ContextMenuItem>
        // </>
    )
}