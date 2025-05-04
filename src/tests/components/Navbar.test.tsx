import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import store  from "../../providers/store";
import "@testing-library/jest-dom"; // Ajout de cette ligne

describe("Navbar", () => {
	it("affiche le logo et le titre", () => {
		render(
			<Provider store={store}>
				<BrowserRouter>
					<Navbar />
				</BrowserRouter>
			</Provider>
		);

		expect(screen.getByText("StreamAccess")).toBeInTheDocument();
		expect(screen.getByTestId("user-avatar")).toBeInTheDocument(); // Utilisation de getByTestId
	});

	it("ouvre le menu utilisateur au clic sur l'avatar", () => {
		render(
			<Provider store={store}>
				<BrowserRouter>
					<Navbar />
				</BrowserRouter>
			</Provider>
		);

		const avatarButton = screen.getByTestId("user-avatar"); // Utilisation de getByTestId
		fireEvent.click(avatarButton);

		const logoutButton = screen.getByTestId("logout-button"); // Cible le bouton avec data-testid
		expect(logoutButton).toBeInTheDocument();

		expect(screen.getByText("Profil")).toBeInTheDocument();
	});

	it("ouvre le sélecteur de thème au clic sur l'icône de palette", () => {
		render(
			<Provider store={store}>
				<BrowserRouter>
					<Navbar />
				</BrowserRouter>
			</Provider>
		);

		const paletteButton = screen.getByRole("button", { name: "Ouvrir le sélecteur de thème" });
		fireEvent.click(paletteButton);

		expect(screen.getByText("Standard")).toBeInTheDocument();
		expect(screen.getByText("Doux")).toBeInTheDocument();
	});
});
