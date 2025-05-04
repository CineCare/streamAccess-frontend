import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import CommentSection from "../../components/CommentSection/CommentSection";
import store from "../../providers/store";
import "@testing-library/jest-dom";

describe("CommentSection", () => {
	it("affiche le nombre de commentaires", () => {
		render(
			<Provider store={store}>
				<CommentSection />
			</Provider>
		);

		const commentCount = screen.getByText("Commentaires (2)", { selector: "h6" }); // Cible uniquement le h6
		expect(commentCount).toBeInTheDocument();
	});

	it("ajoute un commentaire lorsqu'il est soumis", () => {
		render(
			<Provider store={store}>
				<CommentSection />
			</Provider>
		);

		const input = screen.getByPlaceholderText("Écrivez un commentaire...");
		const submitButton = screen.getByText("Envoyer");

		fireEvent.change(input, { target: { value: "Nouveau commentaire" } });
		fireEvent.click(submitButton);

		expect(screen.getByText("Nouveau commentaire")).toBeInTheDocument();
	});
});
