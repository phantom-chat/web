import { useChat } from "@/contexts/chat";
import { UserPopover } from "../user-popover";

export const UserList = () => {
    const { users } = useChat()
    return (
        <div className="absolute border-x px-2 -right-64 w-64 h-full flex flex-col gap-4 py-6">
            {users.filter((user) => user.status === "online").length !== 0 ? (
                <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold px-3 text-muted-foreground">
                        online -{" "}
                        {users.filter((user) => user.status === "online").length}
                    </h4>
                    <div className="flex flex-col gap-0.5">
                        {users
                            .filter((user) => user.status === "online")
                            .map((user) => (
                                <UserPopover user={user} key={user.id} />
                            ))}
                    </div>
                </div>
            ) : null}
            {users.filter((user) => user.status === "offline").length !== 0 ? (
                <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold px-3 text-muted-foreground">
                        offline -{" "}
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
    )
}