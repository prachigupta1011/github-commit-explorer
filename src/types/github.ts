export interface Repo {
    id: number;
    name: string;
    description: string | null;
}

export interface Commit {
    sha: string;
    commit: {
        message: string;
        author: { name: string; date: string };
    };
    author?: { login: string; avatar_url: string };
}

export interface CommitDetails {
    sha: string;
    stats: { total: number; additions: number; deletions: number };
    files: {
        filename: string;
        additions: number;
        deletions: number;
        patch?: string;
    }[];
}

export interface FavouriteCommit {
    sha: string;
    message: string;
}
