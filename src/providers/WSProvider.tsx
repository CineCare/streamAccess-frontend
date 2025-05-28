import { ReactNode } from "react";
import socketIOClient from "socket.io-client";
import IoSocketContext from "../contexts/IoSocketContext";

type IoSocketProviderProps = {
    children: ReactNode;
};

function WSProvider({ children }: IoSocketProviderProps) {
    const ioUrl = "https://streamaccess-dev-backend.codevert.org/events";
    const socket = socketIOClient(ioUrl, { extraHeaders: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });

    function ioClose() {
        socket.close();
    }

    const value = {
        socket,
        ioClose,
    }

    return (
        <IoSocketContext.Provider value={value}>
            {children}
        </IoSocketContext.Provider>)
}

export default WSProvider;