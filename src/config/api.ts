export const API_BASE_URL = "http://100.94.141.111:3333";
export const WS_BASE_URL = "ws://100.94.141.111:3333";

export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/users/login`,
    SIGNUP: `${API_BASE_URL}/users/create`,
    CURRENT_USER: `${API_BASE_URL}/users/@me`,
    UPDATE_USER: `${API_BASE_URL}/users/update`,
    CREATE_MESSAGE: `${API_BASE_URL}/messages/create`,
    DELETE_MESSAGE: `${API_BASE_URL}/messages/delete`,
    CHAT_WEBSOCKET: `${WS_BASE_URL}/chat`
};