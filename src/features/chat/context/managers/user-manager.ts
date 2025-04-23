
import { Status, User } from "@/features/auth/context";
import { Dispatch, SetStateAction } from "react";

export class UserManager {
    private users: User[] = [];
    private setUsers: Dispatch<SetStateAction<User[]>>;

    constructor(setUsers: Dispatch<SetStateAction<User[]>>) {
        this.setUsers = setUsers;
    }

    load(users: User[]) {
        this.setUsers(users);
    }

    updateStatus(userId: string | number, status: Status) {
        this.setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId
                    ? { ...user, status }
                    : user
            )
        );
    }

    clear() {
        this.setUsers([]);
    }
}