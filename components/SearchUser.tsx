type Props = {
  onSearch: (username: string) => void
  loading: boolean
}

export function SearchUser({onSearch, loading}: Props) {
 
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("username") as HTMLInputElement;
    const val = input.value.trim();
    if (val) onSearch(val);
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Search for a GitHub user">
    <label htmlFor="username-input">GitHub username</label>
    <div className="search-row">
      <input
        id="username-input"
        name="username"
        type="text"
        placeholder="e.g. torvalds"
        autoComplete="off"
        spellCheck={false}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Searching…" : "Search"}
      </button>
    </div>
  </form>
  )
}