import { useEffect } from "react";
import socketIOClient  from "socket.io-client";

const SOCKET_URL = "https://streamaccess-dev-backend.codevert.org/events"; // Si le namespace est "/", laissez cette valeur
// const SOCKET_URL = "/events"; // Si le namespace est "/", laissez cette valeur

export const useSocket = () => {

		// Initialisation de la connexion WebSocket
		const socketInstance = socketIOClient(SOCKET_URL, {
			withCredentials: true,
			extraHeaders: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		// setSocket(socketInstance);

		// Nettoyage lors du démontage
    useEffect(() => {
      return () => {
        socketInstance.disconnect();
      };
    }, [socketInstance]);

	return socketInstance;
};
