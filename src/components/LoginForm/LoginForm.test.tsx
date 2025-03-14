import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import store from "../../providers/store";
import LoginForm from "./LoginForm";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LoginForm Component", () => {
  let testStore: ReturnType<typeof configureStore>;

  beforeEach(() => {
    testStore = configureStore({
      reducer: store.getState,
    });
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  it("affiche correctement le formulaire", () => {
    render(
      <Provider store={testStore}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Se connecter/i })).toBeInTheDocument();
  });

  it("soumet le formulaire avec des données valides", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ accessToken: "mockToken", user: { id: 1, email: "test@example.com" } })
    );

    render(
      <Provider store={testStore}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
    await waitFor(() => expect(localStorage.getItem("accessToken")).toBe("mockToken"));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/movies"));
    expect(screen.getByText(/Connexion réussie/i)).toBeInTheDocument();
  });

  it("affiche un message d'erreur en cas d'échec de connexion", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: "Identifiants incorrects" }),
      { status: 401 }
    );

    render(
      <Provider store={testStore}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: "wrongpassword" } });

    fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

    expect(await screen.findByText(/Identifiants incorrects/i)).toBeInTheDocument();
  });
});

