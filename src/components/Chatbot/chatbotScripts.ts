// chatbotScripts.ts
export type ActionKey = "openContactModal" | "goToMovie" | "scrollToFeatures" | "pingApi" | "closeChat";

export type Choice = {
	label: string;
	next: string;
	actions?: ActionKey[];
};

export type BotNode = {
	id: string;
	text?: string;
	choices?: Choice[];
	actions?: ActionKey[];
	/** Si défini, affiche d'abord `text`, puis 3 points pendant N ms, puis exécute `actions`. */
	postActionsDelayMs?: number;
};

export type Script = {
	startNodeId: string;
	nodes: Record<string, BotNode>;
};

// Table de réponses contextuelles par mots-clés
export const keywordResponses: {
	[keyword: string]: { text: string; next?: string; actions?: ActionKey[] };
} = {
	aider: {
		text: "Voici ce que je peux faire :\n- En savoir plus\n- Voir un exemple\n- Connaître les limites\n- Contacter l'équipe\n- Aller sur la page d'un film\nTape un mot-clé ou utilise les boutons ci-dessous !",
	},
	help: {
		text: "Voici ce que je peux faire :\n- En savoir plus\n- Voir un exemple\n- Connaître les limites\n- Contacter l'équipe\n- Aller sur la page d'un film\nTape un mot-clé ou utilise les boutons ci-dessous !",
	},
	film: {
		text: "Je t’emmène sur la page du film demandé.",
		next: "movie",
		actions: ["goToMovie", "closeChat"],
	},
	contact: {
		text: "J’ouvre le formulaire de contact…",
		next: "contact",
		actions: ["openContactModal"],
	},
	exemple: {
		text: "Voici un petit exemple de fonctionnement.",
		next: "example",
		actions: ["pingApi"],
	},
	limite: {
		text: "Fin de la démonstration (les limites sont celles du script).",
		next: "limits",
	},
	"mot-clé": {
		text: "Voici la liste des mots-clés disponibles :\n- help\n- film\n- contact\n- exemple\n- limite\n- mot-clé",
	},
	"mot clé": {
		text: "Voici la liste des mots-clés disponibles :\n- help\n- film\n- contact\n- exemple\n- limite\n- mot-clé",
	},
	"mots clés": {
		text: "Voici la liste des mots-clés disponibles :\n- help\n- film\n- contact\n- exemple\n- limite\n- mot-clé",
	},
	"mots-clés": {
		text: "Voici la liste des mots-clés disponibles :\n- help\n- film\n- contact\n- exemple\n- limite\n- mot-clé",
	},
};

export const demoScript: Script = {
	startNodeId: "welcome",
	nodes: {
		welcome: {
			id: "welcome",
			text: "Bonjour ! Je peux t'aider à découvrir la plateforme. Que veux-tu faire ?",
			choices: [
				{ label: "En savoir plus", next: "learn_more", actions: ["scrollToFeatures"] },
				{ label: "Un exemple", next: "example", actions: ["pingApi"] },
				{ label: "Les limites", next: "limits" },
				{ label: "Contact", next: "contact", actions: ["openContactModal"] },
				{ label: "Aller sur un film", next: "movie", actions: ["goToMovie"] },
			],
		},
		learn_more: {
			id: "learn_more",
			text: "Notre objectif est de rendre le cinéma accessible à tous, en proposant une plateforme inclusive, intuitive et enrichissante. Ce projet a été conçu par des développeurs passionnés pour faciliter la découverte, le partage et l'expérience des films, tout en intégrant des fonctionnalités d'accessibilité et d'accompagnement pour chaque utilisateur.",
		},
		example: { id: "example", text: "Voici un exemple d'action : je peux pinger l'API.", actions: ["pingApi"] },
		limits: { id: "limits", text: "Voici les limites de la démo : je ne réponds qu'à certains mots-clés ou boutons." },
		contact: { id: "contact", text: "J’ouvre le formulaire de contact…", actions: ["openContactModal"] },
		movie: {
			id: "movie",
			text: "Je t’emmène sur la page du film demandé.",
			actions: ["goToMovie", "closeChat"],
			postActionsDelayMs: 2500,
		},
		end: { id: "end", text: "Fin de la démonstration." },
	},
};
