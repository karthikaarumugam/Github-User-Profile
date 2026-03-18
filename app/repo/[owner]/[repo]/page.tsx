// Repo details page (intentionally minimal starter)
// TODO (2-hr scope): Fetch repo details from GitHub and render stats + links.
// Hint: https://api.github.com/repos/{owner}/{repo}
import Link from "next/link";
import { githubHeaders, parseJsonSafely } from "@/lib/github";

type Props = {
  params: { owner: string; repo: string };
};


export default async function RepoPage({ params }: Props) {
  const { owner, repo } = params;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: githubHeaders(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return (
      <main id="main">
        <Link href="/" className="back-link">← Back to search</Link>
        <p className="error-msg">Repository not found or failed to load.</p>
      </main>
    );
  }

  const data = await parseJsonSafely(res);

  return (
    <main id="main">
      <nav aria-label="Breadcrumb">
        <Link href="/" className="back-link">← Back to search</Link>
      </nav>

      <header className="repo-detail-header">
        <h1>{data.name}</h1>
        {data.description && <p className="bio">{data.description}</p>}
        <a href={data.html_url} target="_blank" rel="noreferrer" className="gh-link">
          View on GitHub ↗
        </a>
      </header>

      <div className="repo-detail-stats">
        <div className="stat-item">
          <span className="stat-label">Stars</span>
          <span className="stat-value">★ {data.stargazers_count?.toLocaleString() ?? 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Forks</span>
          <span className="stat-value">⑂ {data.forks_count?.toLocaleString() ?? 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Open issues</span>
          <span className="stat-value">{data.open_issues_count ?? 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Watchers</span>
          <span className="stat-value">{data.watchers_count?.toLocaleString() ?? 0}</span>
        </div>
        {data.language && (
          <div className="stat-item">
            <span className="stat-label">Language</span>
            <span className="stat-value">{data.language}</span>
          </div>
        )}
        <div className="stat-item">
          <span className="stat-label">Default branch</span>
          <span className="stat-value">{data.default_branch}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Last updated</span>
          <span className="stat-value">
            {new Date(data.updated_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </main>
  );
}