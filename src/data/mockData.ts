import { NotificationsState, TagsState } from "../types/interfaces";

export const initialNotificationsState: NotificationsState = {
	list: [
		{ id: 1, text: "Un nouveau film correspondant à vos préférences a été ajouté : 'Happiness therapy'.", read: false },
		{ id: 2, text: "Un nouveau film accessible a été ajouté : 'Intouchable'.", read: false },
		{ id: 3, text: "Quelqu'un a laissé un commentaire sur la vidéo 'La ligne verte' où vous avez aussi commenté.", read: false },
		{ id: 4, text: "Votre mot de passe a été modifié récemment.", read: true },
		{ id: 5, text: "Nouvelle fonctionnalité : nouveau thème par défaut disponible.", read: true },
	],
};

export const initialTagsState: TagsState = {
	list: ["Sous-titres disponibles", "Scènes violentes", "Accessible", "Audio description"],
};
