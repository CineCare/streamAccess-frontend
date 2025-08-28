// chatbotActions.ts
export type ActionKey = "openContactModal" | "goToMovie" | "scrollToFeatures" | "pingApi" | "closeChat";

export type ActionContext = {
	navigate?: (to: string) => void;
	openContact?: () => void;
	fetchJson?: (url: string) => Promise<unknown>;
	closeChat: () => void; // requis
};

export type ActionFn = () => Promise<void> | void;
export type ActionRegistry = Record<ActionKey, ActionFn>;

export const createActions = (ctx: ActionContext): ActionRegistry => ({
	openContactModal: () => ctx.openContact?.(),
	goToMovie: () => {ctx.navigate?.("/movie/1");console.log("je passe");},
	scrollToFeatures: () => {
		document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
	},
	pingApi: async () => {
		try {
			const res = await ctx.fetchJson?.("/api/ping");
			console.log("pingApi:", res);
		} catch (e) {
			console.warn("pingApi failed", e);
		}
	},
	closeChat: () => ctx.closeChat(),
});
