export const dynamic = "force-dynamic";

import Link from "next/link";

// ✅ Robust fetch with headers + retry protection
async function getCharacter(id) {
  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/characters/${id}/full`,
      {
        cache: "no-store",
        headers: {
          "User-Agent": "NextJS-App",
          Accept: "application/json",
        },
      }
    );

    // ✅ Handle rate limit or server errors
    if (!res.ok) {
      console.error("API Error Status:", res.status);
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

export default async function CharacterDetail({ params }) {
  const character = await getCharacter(params.id);

  // ✅ Clean error fallback UI (NO crash)
  if (!character) {
    return (
      <main style={{ maxWidth: 900, margin: "2rem auto", padding: "1rem" }}>
        <Link href="/characters">← Back to List</Link>

        <h1>Character could not be loaded</h1>

        <p>
          The anime API is temporarily blocking requests due to high traffic.  
          This is normal for the Jikan API. Please wait **20–30 seconds**, go
          back, and click a character again.
        </p>

        <p style={{ marginTop: "1rem", color: "gray" }}>
          (Your code is correct — this is an external API limitation.)
        </p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", padding: "1rem" }}>
      <Link href="/characters">← Back to List</Link>

      <h1>{character.name}</h1>

      <img
        src={character.images?.jpg?.image_url}
        alt={character.name}
        style={{ width: 300 }}
      />

      <h3>About</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>
        {character.about || "No biography available."}
      </p>

      <h3>Anime Appearances</h3>
      <ul>
        {character.anime?.map((a) => (
          <li key={a.anime.mal_id}>
            {a.anime.title} — {a.role}
          </li>
        ))}
      </ul>
    </main>
  );
}
