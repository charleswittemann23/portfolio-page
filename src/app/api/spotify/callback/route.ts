import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || "https://negotiate-theme-reactor.ngrok-free.dev/api/spotify/callback";
const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(new URL("/music?error=no_code", request.url));
  }

  try {
    // Exchange code for access token
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      console.error("Token exchange failed:", response.status);
      return NextResponse.redirect(new URL("/music?error=token_failed", request.url));
    }

    const data = await response.json();

    const redirectUrl = `${APP_URL}/music?access_token=${encodeURIComponent(
      data.access_token
    )}&success=true`;
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth callback error:", error);
    const fallbackUrl = `${APP_URL}/music?error=callback_failed`;
    return NextResponse.redirect(fallbackUrl);
  }
}