export type GitHubUser = {
    login: string;
    name: string | null;
    avatarUrl: string;
    htmlUrl: string;
    bio: string | null;
    followers: number;
    following: number;
    publicRepos: number;
}

export type GitHubRepo = {
    id: number;
    name: string;
    description: string | null;
    htmlUrl: string;
    stargazersCount: number;
    forksCount: number;
    openIssuesCount: number;
    size: number;
    updatedAt: string;
    language: string | null;
    owner: { login: string };
  };