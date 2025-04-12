import type { User } from "@/contexts/auth";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const UserPopover = ({ user }: { user: User }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					className={cn(
						"text-sm font-bold text-start hover:bg-secondary/75 cursor-pointer transition px-3 py-2 rounded-md",
						user.status === "offline" && "text-muted-foreground",
					)}
				>
					@{user.username}
				</button>
			</PopoverTrigger>
			<PopoverContent side="left" className="w-fit p-4">
				<div className="inline-flex items-center justify-between min-w-56">
					<div className="flex flex-col items-start justify-center">
						<p className="text-sm font-bold">@{user?.username}</p>
						<div className='inline-flex gap-1 items-center'>
							<div className={cn("rounded-full size-2", user.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-zinc-500')} />
							<p className="text-xs text-muted-foreground">{user.status === 'online' ? 'Online' : 'Offline'}</p>
						</div>
					</div>
					{/* <h1 className="text-sm font-bold">@{user.username}</h1> */}
					<p className="text-sm text-muted-foreground">
						{new Date(user.createdAt).toLocaleDateString("en-GB")}
					</p>
				</div>
			</PopoverContent>
		</Popover>
	);
};
