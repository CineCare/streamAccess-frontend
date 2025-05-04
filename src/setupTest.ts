// src/setupTests.ts
import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

// Crée une instance de fetchMock
const fetchMocker = createFetchMock(vi);

// Active le mock de fetch
fetchMocker.enableMocks();

// Réinitialise les mocks avant chaque test
beforeEach(() => {
	fetchMocker.resetMocks();
});
