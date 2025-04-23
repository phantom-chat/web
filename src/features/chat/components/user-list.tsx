import { UserPopover } from "@/components/user-popover";
import { useChat } from "../context";

export const UserList = () => {
	const { users } = useChat();
	return (
		<div className="h-full w-full hidden lg:flex justify-start">
			<div className="border-r px-2 w-64 h-full flex flex-col gap-4 py-6">
				{users.filter((user) => user.status !== "offline").length !== 0 ? (
					<div className="flex flex-col gap-2">
						<h4 className="text-sm font-bold px-3 text-muted-foreground">
							Online -{" "}
							{users.filter((user) => user.status !== "offline").length}
						</h4>
						<div className="flex flex-col gap-0.5">
							{users
								.filter((user) => user.status !== "offline")
								.map((user) => (
									<UserPopover user={user} key={user.id} />
								))}
						</div>
					</div>
				) : null}
				{users.filter((user) => user.status === "offline").length !== 0 ? (
					<div className="flex flex-col gap-2">
						<h4 className="text-sm font-bold px-3 text-muted-foreground">
							Offline -{" "}
							{users.filter((user) => user.status === "offline").length}
						</h4>
						<div className="flex flex-col gap-0.5">
							{users
								.filter((user) => user.status === "offline")
								.map((user) => (
									<UserPopover user={user} key={user.id} />
								))}
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};
