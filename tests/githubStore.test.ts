import { setActivePinia, createPinia } from "pinia";
import { useGithubStore } from "@/store/githubStore";

describe("Github Store", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    test("should add favourite commit", () => {
        const store = useGithubStore();

        const commit = {
            sha: "123",
            commit: {
                message: "test",
                author: { name: "Prachi", date: "2025-01-01" }
            }
        };

        store.addFavourite(commit as any);
        expect(store.favourites.length).toBe(1);
    });

    test("should remove favourite commit", () => {
        const store = useGithubStore();

        store.favourites = [{ sha: "123", message: "hello world" }];
        store.removeFavourite("123");

        expect(store.favourites.length).toBe(0);
    });
});
