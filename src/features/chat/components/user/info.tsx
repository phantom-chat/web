import { Select, SelectContent, SelectItem, SelectSeparator } from "@/components/ui/select";
import { Status, useAuth } from "@/features/auth/context";
import { useChat } from "@/features/chat/context";
import { cn } from "@/shared/lib/utils";
import { SelectTrigger } from "@radix-ui/react-select";
import type { ClassValue } from "clsx";
import { UserSettings } from "./settings";

export const userStatusClass = {
	online: "bg-green-500 animate-pulse",
	offline: "bg-zinc-500",
	idle: "bg-yellow-500",
} as Record<Status, ClassValue>;

export const userStatus = {
	online: "Online",
	offline: "Offline",
	idle: "Idle",
} as Record<Status, string>;

export const UserInfo = () => {
	const { user } = useAuth();
	const { changeStatus } = useChat();
	if (!user) return;
	return (
		<div className="rounded-md border h-16 p-3 bg-input/30 flex items-center justify-between w-full">
			<Select onValueChange={(v) => changeStatus(v as Status)}>
				<SelectTrigger className="focus:ring-0 focus:outline-none w-full">
					<div className="flex flex-col items-start justify-center w-full">
						<p className="text-sm font-bold">@{user?.username}</p>

						<div className="inline-flex gap-1.5 items-center">
							<div
								className={cn("rounded-full size-2", userStatusClass[user.status])}
							/>
							<p className="text-xs text-muted-foreground">
								{userStatus[user.status]}
							</p>
						</div>
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="online">
						<div className="flex items-center gap-2">
							<div className={cn("rounded-full size-2", userStatusClass.online)} />
							<p className="text-xs text-muted-foreground">
								{userStatus.online}
							</p>
						</div>
					</SelectItem>
					<SelectSeparator />
					<SelectItem value="idle">
						<div className="flex items-center gap-2">
							<div className={cn("rounded-full size-2", userStatusClass.idle)} />
							<p className="text-xs text-muted-foreground">
								{userStatus.idle}
							</p>
						</div>
					</SelectItem>
					<SelectItem value="offline">
						<div className="flex items-center gap-2">
							<div className={cn("rounded-full size-2", userStatusClass.offline)} />
							<p className="text-xs text-muted-foreground">
								{userStatus.offline}
							</p>
						</div>
					</SelectItem>
				</SelectContent>
			</Select>

			{/* <Button size="sm" onClick={() => { changeStatus(Status.ONLINE) }}>Change Status</Button> */}
			<UserSettings />
		</div>
	);
};
