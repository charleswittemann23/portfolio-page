import { NextResponse } from "next/server";

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

async function getAccessToken(request: Request): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.substring(7);
  }
  return null;
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

export async function GET(request: Request) {
  try {
    const accessToken = await getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json(
        { error: "not_authenticated", message: "Please authorize to view your music" },
        { status: 401 }
      );
    }

    const tracks = await getTopTracks(accessToken);

    if (tracks.length === 0) {
      return NextResponse.json(
        { error: "No listening data found" },
        { status: 404 }
      );
    }

    const topAlbums = extractTopAlbums(tracks);

    return NextResponse.json({
      albums: topAlbums,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}