import { useAuth } from "@/contexts/auth";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { UserSettings } from './settings';

export const userStatusClass = {
	online: "bg-green-500 animate-pulse",
	offline: "bg-zinc-500",
	idle: "bg-yellow-500",
} as Record<'online' | 'offline' | 'idle', ClassValue>

export const userStatus = {
	online: "Online",
	offline: "Offline",
	idle: "Idle",
} as Record<'online' | 'offline' | 'idle', string>

export const UserInfo = () => {
	const { isAuthenticated, user } = useAuth();
	if (!user) return;
	return (
		<div className="border rounded-md h-14 p-3.5 bg-input/30 flex items-center justify-between w-full">
			<div className="flex flex-col items-start justify-center">
				<p className="text-sm font-bold">@{user?.username}</p>
				<div className='inline-flex gap-1.5 items-center'>
					<div className={cn("rounded-full size-2", userStatusClass[user.status])} />
					{/* <div className="animate-pulse bg-green-500 rounded-full size-2" /> */}
					{/* <p>oi</p> */}
					<p className="text-xs text-muted-foreground">{userStatus[user.status]}</p>
				</div>
			</div>
			<UserSettings />
		</div>
	);
};
