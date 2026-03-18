"use client";

import { useRef, useState } from "react";
import { SearchUser } from "@/components/SearchUser";
import { UserProfile } from "@/components/UserProfile";
import { RepoList } from "@/components/RepoList";
import type { GitHubUser, GitHubRepo } from "@/lib/types";

type SortOption = "updated" | "stars";

export default function HomePage() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortOption>("updated");
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  async function fetchRepos(username: string, pg: number, s: SortOption, append = false) {
    setLoadingRepos(true);
    try {
      const res = await fetch(
        `/api/github/repos?username=${encodeURIComponent(username)}&page=${pg}&sort=${s}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load repos");
      setHasMore(data.length === 20);
      setRepos((prev) => (append ? [...prev, ...data] : data));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoadingRepos(false);
    }
  }

  async function handleSearch(username: string) {
    setError(null);
    setUser(null);
    setRepos([]);
    setPage(1);
    setHasMore(false);
    setLoadingUser(true);

    try {
      const res = await fetch(`/api/github/user?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.status === 404 ? "User not found" : (data.error || "Request failed"));
      }
      setUser(data);
      setTimeout(() => resultRef.current?.focus(), 0);
      await fetchRepos(username, 1, sort);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoadingUser(false);
    }
  }

  async function handleSortChange(newSort: SortOption) {
    if (!user || newSort === sort) return;
    setSort(newSort);
    setPage(1);
    await fetchRepos(user.login, 1, newSort);
  }

  async function handleLoadMore() {
    if (!user) return;
    const next = page + 1;
    setPage(next);
    await fetchRepos(user.login, next, sort, true);
  }

  return (
    <main id="main">
      <h1>GitHub Profile Explorer</h1>

      <SearchUser onSearch={handleSearch} loading={loadingUser} />
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {loadingUser && "Searching…"}
        {error && `Error: ${error}`}
        {user && !loadingUser && `Loaded profile for ${user.name || user.login}`}
      </div>

      {error && (
        <p className="error-msg" role="alert">
          {error}
        </p>
      )}

      {user && (
        <div ref={resultRef} tabIndex={-1} className="results">
          <UserProfile user={user} />

          {(repos.length > 0 || loadingRepos) && (
            <RepoList
              repos={repos}
              sort={sort}
              hasMore={hasMore}
              loading={loadingRepos}
              onSortChange={handleSortChange}
              onLoadMore={handleLoadMore}
            />
          )}
        </div>
      )}
    </main>
  );
}
