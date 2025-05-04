import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import ThemeSwitcher from "../../components/ThemeSwitcher/ThemeSwitcher";
import store from "../../providers/store";
import "@testing-library/jest-dom";

describe("ThemeSwitcher", () => {
	it("affiche les options de thème", () => {
		render(
			<Provider store={store}>
				<ThemeSwitcher />
			</Provider>
		);

		expect(screen.getByText("Standard")).toBeInTheDocument();
		expect(screen.getByText("Doux")).toBeInTheDocument();
		expect(screen.getByText("Lumineux")).toBeInTheDocument();
	});

	it("change le thème lorsqu'une option est sélectionnée", () => {
		render(
			<Provider store={store}>
				<ThemeSwitcher />
			</Provider>
		);

		const softThemeButton = screen.getByText("Doux");
		fireEvent.click(softThemeButton);

		expect(store.getState().accessibility.preferences.general.theme).toBe("soft");
	});
});
