import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

interface SpotifyTrack {
  album: {
    id: string;
    name: string;
    images: { url: string; width: number; height: number }[];
    artists: { name: string }[];
  };
}

interface AlbumWithPlayCount {
  id: string;
  name: string;
  images: { url: string; width: number; height: number }[];
  artists: { name: string }[];
  playCount: number;
}

async function getAccessTokenFromRefresh(): Promise<string | null> {
  if (!SPOTIFY_REFRESH_TOKEN) {
    console.error("SPOTIFY_REFRESH_TOKEN not configured");
    return null;
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: SPOTIFY_REFRESH_TOKEN,
      }),
    });

    if (!response.ok) {
      console.error("Failed to refresh token:", response.status);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

async function getTopTracks(accessToken: string): Promise<SpotifyTrack[]> {
  const response = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("Failed to get top tracks:", response.status);
    return [];
  }

  const data = await response.json();
  return data.items;
}

function extractTopAlbums(tracks: SpotifyTrack[]): AlbumWithPlayCount[] {
  const albumMap = new Map<string, AlbumWithPlayCount>();

  for (const track of tracks) {
    const album = track.album;
    const existing = albumMap.get(album.id);

    if (existing) {
      existing.playCount += 1;
    } else {
      albumMap.set(album.id, {
        id: album.id,
        name: album.name,
        images: album.images || [],
        artists: album.artists || [],
        playCount: 1,
      });
    }
  }

  return Array.from(albumMap.values())
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 3);
}

export const revalidate = 43200; // Revalidate every 12 hours

export async function GET() {
  try {
    const accessToken = await getAccessTokenFromRefresh();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Spotify refresh token not configured", albums: [] },
        { status: 500 }
      );
    }

    const tracks = await getTopTracks(accessToken);

    if (tracks.length === 0) {
      return NextResponse.json(
        { error: "No listening data found", albums: [] },
        { status: 404 }
      );
    }

    const topAlbums = extractTopAlbums(tracks);

    return NextResponse.json(
      {
        albums: topAlbums,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return NextResponse.json(
      { error: "Internal server error", albums: [] },
      { status: 500 }
    );
  }
}
