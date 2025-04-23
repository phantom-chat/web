import { API_ENDPOINTS } from "@/config/api";
import { emitter } from "@/shared/lib/emitter";
import cookies from "js-cookie";
import { MessagePayload } from "../types";

export class WebSocketManager {
    private socket: WebSocket | null = null;
    private messageManager: any;
    private userManager: any;
    private setSocketAuthenticated: (value: boolean) => void;

    constructor(
        messageManager: any,
        userManager: any,
        setSocketAuthenticated: (value: boolean) => void
    ) {
        this.messageManager = messageManager;
        this.userManager = userManager;
        this.setSocketAuthenticated = setSocketAuthenticated;
    }

    connect() {
        this.socket = new WebSocket(API_ENDPOINTS.CHAT_WEBSOCKET);
        this.setupHandlers();
        return this.socket;
    }

    private setupHandlers() {
        if (!this.socket) return;

        this.socket.onopen = this.handleOpen.bind(this);
        this.socket.onclose = this.handleClose.bind(this);
        this.socket.onmessage = this.handleMessage.bind(this);

        this.setupEventListeners();
    }

    private handleOpen() {
        this.messageManager.clear();
        this.userManager.clear();
        this.sendHandshake();
    }

    private handleClose() {
        this.setSocketAuthenticated(false);
    }

    private handleMessage(event: MessageEvent) {
        const data = JSON.parse(event.data) as MessagePayload;
        emitter.emit(data.event, data as any);
    }

    private setupEventListeners() {
        emitter.on("handshake", ({ status }) => {
            if (status === "success") {
                this.setSocketAuthenticated(true);
            } else {
                this.setSocketAuthenticated(false);
            }
        });

        emitter.on("userUpdate", ({ user }) =>
            this.userManager.updateStatus(user.id, user.status));
        emitter.on("usersFetch", ({ users }) =>
            this.userManager.load(users));
        emitter.on("messagesFetch", ({ messages }) =>
            this.messageManager.load(messages));
        emitter.on("messageCreate", (message) =>
            this.messageManager.add(message));
        emitter.on("messageDelete", ({ id }) =>
            this.messageManager.remove(id));
    }

    private sendHandshake() {
        this.send({
            event: "handshake",
            type: "request",
            token: cookies.get("phantom-token"),
            timestamp: Date.now(),
        });
    }

    send(data: any) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    disconnect() {
        if (this.socket?.readyState === WebSocket.OPEN ||
            this.socket?.readyState === WebSocket.CONNECTING) {
            this.socket.close();
        }
    }
}