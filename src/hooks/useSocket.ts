import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Remplacez "/namespace" par le namespace correct (par exemple, "/notifications" ou "/chat")
const SOCKET_URL = "/events"; // Si le namespace est "/", laissez cette valeur

export const useSocket = () => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		// Initialisation de la connexion WebSocket
		const socketInstance = io(SOCKET_URL, {
			withCredentials: true,
			extraHeaders: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		setSocket(socketInstance);

		// Nettoyage lors du démontage
		return () => {
			socketInstance.disconnect();
		};
	}, []);

	return socket;
};
