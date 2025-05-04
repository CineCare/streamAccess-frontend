import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchMovieById, fetchStreamUrl, createMovie } from "../../services/FetcherService";

// Simulation de URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => "mockBlobURL");

vi.mock("global", () => ({
	fetch: vi.fn(),
	localStorage: {
		getItem: vi.fn(),
	},
}));

beforeEach(() => {
	vi.clearAllMocks();
});

describe("FetcherService", () => {
	it("fetchMovieById should fetch movie details by ID", async () => {
		vi.spyOn(global.localStorage, "getItem").mockReturnValue("mockToken");
		vi.spyOn(global, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ id: 1, title: "Test Movie" }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			})
		);

		const movie = await fetchMovieById(1);
		expect(movie).toEqual({ id: 1, title: "Test Movie" });
		expect(global.fetch).toHaveBeenCalledWith(
			"https://streamaccess-dev-backend.codevert.org/movies/1",
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: "Bearer mockToken",
				}),
			})
		);
	});

	it("fetchStreamUrl should return a blob URL", async () => {
		vi.spyOn(global.localStorage, "getItem").mockReturnValue("mockToken");
		vi.spyOn(global, "fetch").mockResolvedValue(
			new Response("mockData", {
				status: 200,
				headers: { "Content-Type": "application/octet-stream" },
			})
		);

		const url = await fetchStreamUrl();
		expect(url).toBe("mockBlobURL"); // Vérifie que l'URL simulée est retournée
		expect(global.fetch).toHaveBeenCalledWith(
			"https://streamaccess-dev-backend.codevert.org/streams/",
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: "Bearer mockToken",
				}),
			})
		);
	});

	it("createMovie should send a POST request with form data", async () => {
		vi.spyOn(global.localStorage, "getItem").mockReturnValue("mockToken");
		vi.spyOn(global, "fetch").mockResolvedValue(new Response(null, { status: 201 }));

		await createMovie({
			title: "New Movie",
			description: "Description",
			releaseDate: "2024-01-01",
		});

		expect(global.fetch).toHaveBeenCalledWith(
			"https://streamaccess-dev-backend.codevert.org/movies",
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					title: "New Movie",
					description: "Description",
					releaseDate: "2024-01-01",
				}),
			})
		);
	});
});
