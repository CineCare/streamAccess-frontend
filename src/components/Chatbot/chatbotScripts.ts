// chatbotScripts.ts
export type ActionKey = "openContactModal" | "goToMovie" | "scrollToFeatures" | "pingApi" | "closeChat";

export type Choice = {
	label: string;
	next: string; // id du prochain nœud
	actions?: ActionKey[];
};

export type BotNode = {
	id: string;
	text?: string; // message du bot (facultatif si c’est juste des actions)
	choices?: Choice[]; // quick replies
	actions?: ActionKey[]; // actions au moment d’entrer dans ce nœud
};

export type Script = {
	startNodeId: string;
	nodes: Record<string, BotNode>;
};

// Exemple de script
export const demoScript: Script = {
	startNodeId: "welcome",
	nodes: {
		welcome: {
			id: "welcome",
			text: "Bonjour! Je suis le chatbot de démonstration.",
			// à la 2ᵉ interaction, tu peux afficher des choix (depuis l’UI on pourra décider quand)
			choices: [
				{ label: "En savoir plus", next: "learn_more", actions: ["scrollToFeatures"] },
				{ label: "Un exemple", next: "example" },
				{ label: "Les limites", next: "limits" },
				{ label: "Contact", next: "contact", actions: ["openContactModal"] },
				{ label: "Veux tu regarder Freaks ?", next: "movie", actions: ["goToMovie"] },
			],
		},
		learn_more: {
			id: "learn_more",
			text: "Pour l'instant, je réponds avec un script préétabli.",
		},
		example: {
			id: "example",
			text: "Voici un petit exemple de fonctionnement.",
			actions: ["pingApi"],
		},
		limits: {
			id: "limits",
			text: "Fin de la démonstration (les limites sont celles du script).",
		},
		contact: {
			id: "contact",
			text: "J’ouvre le formulaire de contact…",
			actions: ["openContactModal"],
		},
		movie: {
			id: "movie",
			text: "Je t’emmène sur la page du film demandé.",
			actions: ["goToMovie", "closeChat"],
		},
		end: {
			id: "end",
			text: "Fin de la démonstration.",
		},
	},
};
