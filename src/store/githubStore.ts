import { defineStore } from "pinia";
import axios from "axios";
import type { Repo, Commit, CommitDetails, FavouriteCommit } from "@/types/github";

export const useGithubStore = defineStore("github", {
    state: () => ({
        repos: [] as Repo[],
        commits: [] as Commit[],
        favourites: [] as FavouriteCommit[],
        commitDetails: null as CommitDetails | null,
        error: "" as string
    }),

    actions: {
        async fetchRepos(username: string) {
            this.error = "";
            try {
                const { data } = await axios.get(
                    `https://api.github.com/users/${username}/repos`
                );
                this.repos = data;
                if (!data.length) this.error = "No repositories found.";
            } catch (err: any) {
                this.error = err.response?.status === 404
                    ? "Invalid username."
                    : "Error fetching repositories.";
            }
        },

        async fetchCommits(username: string, repo: string, page = 1) {

            console.log("LOAD CALLED WITH: in commit", repo);
            const { data } = await axios.get(
                `https://api.github.com/repos/${username}/${repo}/commits?per_page=10&page=${page}`
            );

            if (page === 1) {
                this.commits = data;
            } else {
                this.commits.push(...data);
            }
        },


        async fetchCommitDetails(username: string, repo: string, sha: string) {
            console.log("LOAD CALLED WITH: in store", repo);
            const { data } = await axios.get(
                `https://api.github.com/repos/${username}/${repo}/commits/${sha}`
            );
            this.commitDetails = data;
        },


        addFavourite(commit: Commit) {
            if (!this.favourites.some(f => f.sha === commit.sha)) {
                this.favourites.push({
                    sha: commit.sha,
                    message: commit.commit.message
                });
            }
        },

        removeFavourite(sha: string) {
            this.favourites = this.favourites.filter(f => f.sha !== sha);
        }
    }
});
