import { Socket } from "socket.io-client";

export interface IoProvider {
    socket:Socket,
    ioClose: () => void
}