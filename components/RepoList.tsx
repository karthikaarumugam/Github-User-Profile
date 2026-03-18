import type { GitHubRepo } from "@/lib/types";

type SortOption = "updated" | "stars";

type Props = {
  repos: GitHubRepo[];
  sort: SortOption;
  hasMore: boolean;
  loading: boolean;
  onSortChange: (s: SortOption) => void;
  onLoadMore: () => void;
};

export function RepoList({ repos, sort, hasMore, loading, onSortChange, onLoadMore }: Props) {
  return (
    <section aria-label="Repositories">
      <div className="sort-bar">
        <span>Sort:</span>
        <button
          onClick={() => onSortChange("updated")}
          aria-pressed={sort === "updated"}
          className={sort === "updated" ? "sort-btn active" : "sort-btn"}
        >
          Recently updated
        </button>
        <button
          onClick={() => onSortChange("stars")}
          aria-pressed={sort === "stars"}
          className={sort === "stars" ? "sort-btn active" : "sort-btn"}
        >
          Most starred
        </button>
      </div>

      <ul className="repo-list">
        {repos.map((repo) => (
          <li key={repo.id} className="repo-card">
            <div className="repo-header">
              <a href={`/repo/${repo.owner.login}/${repo.name}`} className="repo-name">
                {repo.name}
              </a>
              {repo.language && <span className="lang-tag">{repo.language}</span>}
            </div>
            <p className="repo-desc">
              {repo.description ?? <em>No description</em>}
            </p>
            <div className="repo-meta">
              <span title="Stars">★ {repo.stargazers_count.toLocaleString()}</span>
              <span title="Forks">⑂ {repo.forks_count.toLocaleString()}</span>
              <span title="Open issues">◎ {repo.open_issues_count}</span>
              <span title="Size">{formatSize(repo.size)}</span>
              <span>Updated {formatDate(repo.updated_at)}</span>
            </div>
            <a href={repo.html_url} target="_blank" rel="noreferrer" className="gh-link">
              GitHub ↗
            </a>
          </li>
        ))}
      </ul>

      {loading && <p className="status-msg">Loading…</p>}

      {hasMore && !loading && (
        <button onClick={onLoadMore} className="load-more-btn">
          Load more
        </button>
      )}
    </section>
  );
}

function formatSize(kb: number) {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
