import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Ajout de l'import pour les extensions
import { describe, it, expect } from "vitest";
import StatsPanel from "../../components/EcoStats/EcoStats";

describe("StatsPanel", () => {
	it("should render the stats icon button", () => {
		render(<StatsPanel />);
		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument(); // Correction : utilisation de toBeInTheDocument
	});

	it("should open the stats drawer when the button is clicked", () => {
		render(<StatsPanel />);
		const button = screen.getByRole("button");
		fireEvent.click(button);
		const drawerTitle = screen.getByText("Statistiques Éco vs Standard");
		expect(drawerTitle).toBeInTheDocument(); // Correction : utilisation de toBeInTheDocument
	});
});
