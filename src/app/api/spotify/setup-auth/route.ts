import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || "https://negotiate-theme-reactor.ngrok-free.dev/api/spotify/callback";

export async function GET() {
  if (!SPOTIFY_CLIENT_ID) {
    return NextResponse.json(
      { error: "Spotify client ID not configured" },
      { status: 500 }
    );
  }

  const scopes = ["user-top-read"].join(" ");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: scopes,
    redirect_uri: REDIRECT_URI,
    state: "setup",
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
