import { ReactNode, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";

type IoSocketProviderProps = {
    children: ReactNode;
};

function WSProvider({ children }: IoSocketProviderProps) {
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on("connect", () => {
                console.log("Connecté au serveur WebSocket");
            });

            socket.on("disconnect", () => {
                console.log("Déconnecté du serveur WebSocket");
            });

            // Exemple : écoute d'un événement personnalisé
            socket.on("message", (data) => {
                console.log("Notification reçue :", data);
            });
        }

        return () => {
            if (socket) {
                socket.off("connect");
                socket.off("disconnect");
                socket.off("message");
            }
        };
    }, [socket]);

    return <>{children}</>;
}

export default WSProvider;