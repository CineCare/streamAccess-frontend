import { CommentsState, NotificationsState, TagsState } from "../types/interfaces";

export const initialNotificationsState: NotificationsState = {
	list: [
		{ id: 1, text: "Notification utilisateur 2", read: false },
		{ id: 2, text: "Notification système 1", read: false },
		{ id: 3, text: "Notification utilisateur 1", read: true },
	],
};

export const initialCommentsState: CommentsState = {
	list: [
		{
			id: 1,
			userId: 1,
			userName: "Marie D.",
			content: "Excellent film, j'ai particulièrement apprécié l'audio description qui est très bien faite.",
			createdAt: "2024-01-15T14:23:00Z",
		},
		{
			id: 2,
			userId: 2,
			userName: "Thomas R.",
			userAvatar: "https://i.pravatar.cc/150?u=2",
			content: "Les sous-titres sont très clairs et bien synchronisés. Merci !",
			createdAt: "2024-01-14T09:15:00Z",
		},
	],
};

export const initialTagsState: TagsState = {
	list: ["Sous-titres disponibles", "Scènes violentes", "Accessible", "Audio description"],
};
