import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings } from "lucide-react";

export const UserSettings = () => {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					type="button"
					title="Settings"
					className="items-center justify-center size-8 hover:bg-secondary transition flex rounded-md"
				>
					<Settings className="size-5" />
				</button>
			</TooltipTrigger>
			<TooltipContent>User settings</TooltipContent>
		</Tooltip>
	);
};
