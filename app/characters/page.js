"use client";

import { useState } from "react";
import Link from "next/link";

export default function CharactersPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query)}`
      );

      if (!res.ok) throw new Error("Failed to fetch characters");

      const data = await res.json();
      setResults(data.data || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", padding: "1rem" }}>
      <h1>Anime Character Search</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a character (Naruto, Sasuke...)"
          style={{ padding: "0.5rem", width: "70%" }}
        />
        <button style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
          gap: "1rem",
        }}
      >
        {results.map((char) => (
          <li
            key={char.mal_id}
            style={{ border: "1px solid #ccc", padding: "0.5rem" }}
          >
<Link href={`/characters/${char.mal_id}`} style={{ textDecoration: "none", color: "inherit" }}>
  <div>
    <img
      src={char.images?.jpg?.image_url}
      alt={char.name}
      style={{ width: "100%" }}
    />
    <h3>{char.name}</h3>
  </div>
</Link>

          </li>
        ))}
      </ul>
    </main>
  );
}


// redeploy trigger
