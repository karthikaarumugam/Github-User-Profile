import type {GitHubUser} from "@/lib/types";

type Props = {user: GitHubUser}

export function UserProfile({user}: Props) {
    const displayName = user.name || user.login;

    return (
        <div className="user-card">
        <img
          src={user.avatar_url}
          alt={`${displayName}'s avatar`}
          width={80}
          height={80}
          className="avatar"
        />
        <div className="user-info">
          <h2>{displayName}</h2>
          {user.name && <p className="login">@{user.login}</p>}
          {user.bio && <p className="bio">{user.bio}</p>}
          <p className="user-stats">
            <span>{user.followers.toLocaleString()} followers</span>
            <span>{user.following.toLocaleString()} following</span>
            <span>{user.public_repos} repos</span>
          </p>
          <a href={user.html_url} target="_blank" rel="noreferrer" className="gh-link">
            View on GitHub ↗
          </a>
        </div>
      </div>
    )
}