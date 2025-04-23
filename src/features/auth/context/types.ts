import { Dispatch, SetStateAction } from "react";

export enum Status {
    ONLINE = "online",
    OFFLINE = "offline",
    IDLE = "idle",
}

export type User = {
    id: string;
    email: string;
    status: Status;
    username: string;
    createdAt: string;
    bot: boolean;
};

export type AuthType = {
    isAuthenticated: boolean;
    user: User | null;
    logout: () => void;
    setUser: Dispatch<SetStateAction<User | null>>;
};