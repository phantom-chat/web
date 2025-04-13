import { Settings } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export const UserSettings = () => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button className="items-center justify-center size-8 hover:bg-secondary transition flex rounded-md">
                    <Settings className="size-5" />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                User settings
            </TooltipContent>
        </Tooltip>
    )
}