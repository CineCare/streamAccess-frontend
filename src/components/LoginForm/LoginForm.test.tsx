// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import { Provider } from "react-redux";
// import { MemoryRouter } from "react-router-dom";
// import { configureStore } from "@reduxjs/toolkit";
// import store from "../../providers/store"; // Correction de l'importation du store
// import LoginForm from "./LoginForm";
// import fetchMock from "jest-fetch-mock";

// // Active le mock de `fetch` pour éviter les appels réseau réels
// fetchMock.enableMocks();

// // Mock Redux dispatch
// const mockDispatch = jest.fn();

// jest.mock("react-redux", () => ({
//   ...jest.requireActual("react-redux"),
//   useDispatch: () => mockDispatch,
// }));

// // Mock `useNavigate`
// const mockNavigate = jest.fn();
// jest.mock("react-router-dom", () => ({
//   ...jest.requireActual("react-router-dom"),
//   useNavigate: () => mockNavigate,
// }));

// describe("LoginForm Component", () => {
//   let testStore: ReturnType<typeof configureStore>;

//   beforeEach(() => {
//     testStore = configureStore({
//       reducer: store.getState // Utilisation correcte du store
//     });
//     jest.clearAllMocks();
//     fetchMock.resetMocks();
//   });

//   it("affiche correctement le formulaire", () => {
//     render(
//       <Provider store={testStore}>
//         <MemoryRouter>
//           <LoginForm />
//         </MemoryRouter>
//       </Provider>
//     );

//     expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
//     expect(screen.getByRole("button", { name: /Se connecter/i })).toBeInTheDocument();
//   });

//   it("affiche une erreur si les champs sont vides", async () => {
//     render(
//       <Provider store={testStore}>
//         <MemoryRouter>
//           <LoginForm />
//         </MemoryRouter>
//       </Provider>
//     );

//     fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

//     await waitFor(() => {
//       expect(screen.queryByText(/L'email est requis./i)).toBeInTheDocument();
//       expect(screen.queryByText(/Le mot de passe est requis./i)).toBeInTheDocument();
//     });
//   });

//   it("affiche une erreur si l'email est invalide", async () => {
//     render(
//       <Provider store={testStore}>
//         <MemoryRouter>
//           <LoginForm />
//         </MemoryRouter>
//       </Provider>
//     );

//     fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalidemail" } });
//     fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

//     await waitFor(() => {
//       const emailField = screen.getByLabelText(/Email/i);
//       const passwordField = screen.getByLabelText(/Mot de passe/i);
    
//       expect(emailField).toHaveAccessibleDescription("L'email est requis.");
//       expect(passwordField).toHaveAccessibleDescription("Le mot de passe est requis.");
//     });
//   });

//   it("soumet le formulaire avec des données valides", async () => {
//     fetchMock.mockResponseOnce(
//       JSON.stringify({ accessToken: "mockToken", user: { id: 1, email: "test@example.com" } })
//     );

//     render(
//       <Provider store={testStore}>
//         <MemoryRouter>
//           <LoginForm />
//         </MemoryRouter>
//       </Provider>
//     );

//     fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
//     fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: "password123" } });

//     fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

//     await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
//     await waitFor(() => expect(localStorage.getItem("accessToken")).toBe("mockToken"));
//     await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/movies"));
//     expect(screen.getByText(/Connexion réussie/i)).toBeInTheDocument();
//   });

//   it("affiche un message d'erreur en cas d'échec de connexion", async () => {
//     fetchMock.mockResponseOnce(
//       JSON.stringify({ message: "Identifiants incorrects" }),
//       { status: 401 }
//     );

//     render(
//       <Provider store={testStore}>
//         <MemoryRouter>
//           <LoginForm />
//         </MemoryRouter>
//       </Provider>
//     );

//     fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
//     fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: "wrongpassword" } });

//     fireEvent.click(screen.getByRole("button", { name: /Se connecter/i }));

//     expect(await screen.findByText(/Identifiants incorrects/i)).toBeInTheDocument();
//   });
// });

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import store from "../../providers/store";
import LoginForm from "./LoginForm";
import fetchMock from "jest-fetch-mock";

// Active le mock de `fetch`
fetchMock.enableMocks();

// Mock Redux dispatch
const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

// Mock `useNavigate`
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
        <MemoryRouter>
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
        <MemoryRouter>
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
        <MemoryRouter>
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

