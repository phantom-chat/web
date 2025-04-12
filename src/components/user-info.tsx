import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from "@/contexts/auth";
import { Settings } from "lucide-react";

export const UserInfo = () => {
	const { isAuthenticated, user } = useAuth();
	if (!isAuthenticated) return;
	return (
		<div className="border rounded-md h-14 p-3.5 bg-input/30 flex items-center justify-between w-full">
			<div className="flex flex-col items-start justify-center">
				<p className="text-sm font-bold">@{user?.username}</p>
				<div className='inline-flex gap-1 items-center'>
					<div className="animate-pulse bg-green-500 rounded-full size-2" />
					<p className="text-xs text-muted-foreground">Online</p>
				</div>
			</div>
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
		</div>
	);
};
