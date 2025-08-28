import React, { useEffect, useMemo, useRef, useState } from "react";
import { keyframes } from "@mui/system";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

import type { Script, BotNode, ActionKey } from "./chatbotScripts";
import { demoScript, keywordResponses } from "./chatbotScripts";
import type { ActionRegistry, ActionContext } from "./chatbotActions";
import { createActions } from "./chatbotActions";

interface Message {
	sender: "user" | "bot";
	text: string;
	typing?: boolean;
}

const TYPING_DELAY_MS = 4000;

type ChatbotProps = {
	script?: Script;
	actionsCtx?: Omit<ActionContext, "closeChat">; // on injectera closeChat nous-mêmes
};

const Chatbot: React.FC<ChatbotProps> = ({ script = demoScript, actionsCtx }) => {
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isTyping, setIsTyping] = useState(false);

	// moteur de script
	const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);

	const inputRef = useRef<HTMLInputElement | null>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

	const typingDots = useMemo(
		() => keyframes`
      0%   { opacity: .2; transform: translateY(0); }
      20%  { opacity: 1;  transform: translateY(-2px); }
      40%  { opacity: .2; transform: translateY(0); }
      100% { opacity: .2; transform: translateY(0); }
    `,
		[]
	);

	const getNode = (id: string | null): BotNode | null => (id ? script.nodes[id] ?? null : null);

	// ✅ Registre d’actions avec contexte capturé (PAS d’argument à l’appel)
	const actions: ActionRegistry = useMemo(
		() =>
			createActions({
				fetchJson: async url => fetch(url).then(r => r.json()),
				...(actionsCtx ?? {}),
				closeChat: () => setOpen(false), // toujours disponible
			}),
		[actionsCtx]
	);

	// scroll bas auto
	useEffect(() => {
		scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
	}, [messages, isTyping]);

	// focus après réponse
	useEffect(() => {
		if (!isTyping && open) inputRef.current?.focus();
	}, [isTyping, open]);

	// ouverture => 1er nœud (ne reset plus l'historique à la fermeture)
	useEffect(() => {
		if (open && !currentNodeId) {
			const startId = script.startNodeId;
			setCurrentNodeId(startId);
			const first = script.nodes[startId];

			if (first?.text) {
				setMessages([{ sender: "bot", text: first.text }]);
			}
			// ✅ exécuter immédiatement les actions d'entrée s'il n'y a pas de texte
			if (first?.actions?.length) {
				if (!first.text) {
					// actions "silencieuses"
					runActions(first.actions).then(() => {
						// si le nœud de départ ne parle pas, reste dessus ou va à un suivant si tu en as un
					});
				} else {
					// actions après le message
					runActions(first.actions);
				}
			}
		}
		// Ne reset plus l'historique à la fermeture du tiroir
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	// Factorisation de la gestion des actions et de l'enchaînement des nœuds
	const runActions = async (keys: ActionKey[] = []) => {
		for (const k of keys) {
			try {
				await actions[k]?.();
			} catch (e) {
				console.warn("Action failed:", k, e);
			}
		}
	};

	/**
	 * Affiche un message du bot, exécute les actions, puis passe au nœud suivant si besoin.
	 * Gère le délai d'attente et la bulle "typing" si nécessaire.
	 */
	const botReply = async ({
		text,
		nextId,
		actionsToRun = [],
		delayMs = TYPING_DELAY_MS,
		showTyping = true,
		immediateText = false,
	}: {
		text?: string;
		nextId?: string;
		actionsToRun?: ActionKey[];
		delayMs?: number;
		showTyping?: boolean;
		immediateText?: boolean;
	}) => {
		// Détermine si on doit relancer l'utilisateur
		const shouldAskNext = () => {
			// Si on ferme le chat ou si c'est la fin, on ne relance pas
			if (actionsToRun.includes("closeChat")) return false;
			if (nextId === "end") return false;
			return true;
		};

		// Ajoute la relance si besoin
		const addFollowUp = (msg?: string) =>
			shouldAskNext()
				? msg
					? msg + "\n\nQue souhaites-tu faire maintenant ? Tu peux écrire directement ou utiliser un mot-clé."
					: "Que souhaites-tu faire maintenant ? Tu peux écrire directement ou utiliser un mot-clé."
				: msg;

		if (!text && actionsToRun.length === 0) {
			if (nextId) setCurrentNodeId(nextId);
			return;
		}

		const finalText = addFollowUp(text);

		if (immediateText && finalText) {
			setMessages(prev => [...prev, { sender: "bot", text: finalText }]);
		} else if (showTyping) {
			setIsTyping(true);
			setMessages(prev => [...prev, { sender: "bot", text: "", typing: true }]);
		}

		setTimeout(
			async () => {
				if (showTyping) {
					setIsTyping(false);
					setMessages(prev => {
						const copy = [...prev];
						if (copy.length && copy[copy.length - 1].typing) copy.pop();
						if (finalText) copy.push({ sender: "bot", text: finalText });
						return copy;
					});
				}
				if (actionsToRun.length) {
					await runActions(actionsToRun);
				}
				if (nextId) setCurrentNodeId(nextId);
			},
			showTyping ? delayMs : 0
		);
	};

	const handleSend = () => {
		const value = input.trim();
		if (!value || isTyping) return;

		setMessages(prev => [...prev, { sender: "user", text: value }]);
		setInput("");

		// Détection de mots-clés dans le message utilisateur
		const lower = value.toLowerCase();
		const found = Object.entries(keywordResponses).find(([k]) => lower.includes(k));
		if (found) {
			const { text, next, actions } = found[1];
			botReply({
				text,
				nextId: next,
				actionsToRun: actions,
				showTyping: true,
			});
			return;
		}

		const node = getNode(currentNodeId);

		// Si le nœud courant propose des choix, on n'avance pas, on propose les actions
		if (node?.choices?.length) {
			botReply({ text: "Choisis une option ci-dessous 🙂", showTyping: false });
			return;
		}

		// Sinon, on va vers un nœud informatif ou la fin
		const nextNode = getNode("learn_more") ?? getNode("end");
		botReply({ text: nextNode?.text, nextId: nextNode?.id, actionsToRun: nextNode?.actions });
	};

	const handleChoice = (choice: { label: string; next: string; actions?: ActionKey[] }) => {
		if (isTyping) return;

		setMessages(prev => [...prev, { sender: "user", text: choice.label }]);

		const nextNode = getNode(choice.next) ?? getNode("end");
		const actionsToRun = [...(choice.actions ?? []), ...(nextNode?.actions ?? [])];

		if (nextNode?.postActionsDelayMs) {
			// Affiche le texte immédiatement, puis "typing", puis actions
			botReply({
				text: nextNode.text,
				nextId: nextNode.id,
				actionsToRun,
				delayMs: nextNode.postActionsDelayMs,
				showTyping: true,
				immediateText: true,
			});
		} else {
			// "typing" puis texte puis actions (comportement standard)
			botReply({
				text: nextNode?.text,
				nextId: nextNode?.id,
				actionsToRun,
				showTyping: true,
			});
		}
	};

	const node = getNode(currentNodeId);

	return (
		<>
			<IconButton
				color="inherit"
				onClick={() => setOpen(true)}
				aria-label="Ouvrir le chatbot"
				sx={{ marginRight: 2 }}>
				<Box
					width="1.5rem"
					height="1.5rem">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 32 32"
						width="100%"
						height="100%"
						fill="none"
						stroke="currentColor"
						strokeWidth="0.5">
						<path
							d="M16,19a6.9908,6.9908,0,0,1-5.833-3.1287l1.666-1.1074a5.0007,5.0007,0,0,0,8.334,0l1.666,1.1074A6.9908,6.9908,0,0,1,16,19Z"
							stroke="currentColor"
							strokeWidth="0.5"
							fill="currentColor"
						/>
						<path
							d="M20,8a2,2,0,1,0,2,2A1.9806,1.9806,0,0,1,20,8Z"
							stroke="currentColor"
							strokeWidth="0.5"
							fill="currentColor"
						/>
						<path
							d="M12,8a2,2,0,1,0,2,2A1.9806,1.9806,0,0,1,12,8Z"
							stroke="currentColor"
							strokeWidth="0.5"
							fill="currentColor"
						/>
						<path
							d="M17.7358,30,16,29l4-7h6a1.9966,1.9966,0,0,0,2-2V6a1.9966,1.9966,0,0,0-2-2H6A1.9966,1.9966,0,0,0,4,6V20a1.9966,1.9966,0,0,0,2,2h9v2H6a3.9993,3.9993,0,0,1-4-4V6A3.9988,3.9988,0,0,1,6,2H26a3.9988,3.9988,0,0,1,4,4V20a3.9993,3.9993,0,0,1-4,4H21.1646Z"
							stroke="currentColor"
							strokeWidth="0.5"
							fill="currentColor"
						/>
					</svg>
				</Box>
			</IconButton>

			<Drawer
				anchor="right"
				open={open}
				onClose={() => setOpen(false)}>
				<Box sx={{ width: 320, p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
					<Box sx={{ display: "flex", gap: 1 }}>
						<Box
							width="1.5rem"
							height="1.5rem">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 32 32"
								width="100%"
								height="100%"
								fill="none"
								stroke="currentColor"
								strokeWidth="0.5">
								<path
									d="M16,19a6.9908,6.9908,0,0,1-5.833-3.1287l1.666-1.1074a5.0007,5.0007,0,0,0,8.334,0l1.666,1.1074A6.9908,6.9908,0,0,1,16,19Z"
									stroke="currentColor"
									strokeWidth="0.5"
									fill="currentColor"
								/>
								<path
									d="M20,8a2,2,0,1,0,2,2A1.9806,1.9806,0,0,1,20,8Z"
									stroke="currentColor"
									strokeWidth="0.5"
									fill="currentColor"
								/>
								<path
									d="M12,8a2,2,0,1,0,2,2A1.9806,1.9806,0,0,1,12,8Z"
									stroke="currentColor"
									strokeWidth="0.5"
									fill="currentColor"
								/>
								<path
									d="M17.7358,30,16,29l4-7h6a1.9966,1.9966,0,0,0,2-2V6a1.9966,1.9966,0,0,0-2-2H6A1.9966,1.9966,0,0,0,4,6V20a1.9966,1.9966,0,0,0,2,2h9v2H6a3.9993,3.9993,0,0,1-4-4V6A3.9988,3.9988,0,0,1,6,2H26a3.9988,3.9988,0,0,1,4,4V20a3.9993,3.9993,0,0,1-4,4H21.1646Z"
									stroke="currentColor"
									strokeWidth="0.5"
									fill="currentColor"
								/>
							</svg>
						</Box>
						<Typography
							variant="h6"
							gutterBottom>
							Chatbot
						</Typography>
					</Box>
					<Box
						ref={scrollRef}
						sx={{ flexGrow: 1, overflowY: "auto", mb: 2, pr: 0.5 }}>
						{messages.map((msg, idx) => {
							const isUser = msg.sender === "user";
							const isTypingBubble = !!msg.typing;

							return (
								<Box
									key={idx}
									sx={{
										textAlign: isUser ? "right" : "left",
										mb: 1.25,
										display: "flex",
										justifyContent: isUser ? "flex-end" : "flex-start",
									}}>
									<Box
										sx={{
											maxWidth: "85%",
											display: "inline-flex",
											alignItems: "center",
											px: 1.25,
											py: 0.75,
											borderRadius: 1.5,
											bgcolor: isUser ? "primary.main" : "secondary.main",
											color: isUser ? "primary.contrastText" : "text.primary",
										}}>
										{isTypingBubble ? (
											<Box sx={{ display: "inline-flex", gap: 0.6, alignItems: "center", lineHeight: 0, color: "text.primary" }}>
												{[0, 1, 2].map(i => (
													<Box
														key={i}
														component="span"
														sx={{
															width: 6,
															height: 6,
															borderRadius: "50%",
															bgcolor: "currentColor",
															display: "inline-block",
															animation: `${typingDots} 1s infinite`,
															animationDelay: `${i * 0.15}s`,
														}}
													/>
												))}
											</Box>
										) : (
											<Typography
												variant="body2"
												sx={{ whiteSpace: "pre-wrap" }}>
												{msg.text}
											</Typography>
										)}
									</Box>
								</Box>
							);
						})}

						{/* Quick replies : afficher pour tous les nœuds qui ont des choix, sauf 'movie' et 'end' */}
						{!!node?.choices?.length && !isTyping && node.id !== "movie" && node.id !== "end" && (
							<Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
								{node.choices.map(opt => (
									<Chip
										key={opt.label}
										label={opt.label}
										onClick={() => handleChoice(opt)}
										clickable
										variant="outlined"
										sx={{ borderRadius: 1.5 }}
									/>
								))}
							</Box>
						)}
					</Box>

					<Box sx={{ display: "flex", gap: 1 }}>
						<TextField
							inputRef={inputRef}
							autoFocus
							fullWidth
							size="small"
							placeholder="Votre message"
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyDown={e => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleSend();
								}
							}}
							disabled={isTyping}
						/>
						<Button
							variant="contained"
							onClick={handleSend}
							disabled={isTyping}>
							Envoyer
						</Button>
					</Box>
				</Box>
			</Drawer>
		</>
	);
};

export default Chatbot;
