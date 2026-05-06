"use client";

import { Flex, Heading, Text, Column, Button } from "@once-ui-system/core";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Album {
  name: string;
  images: { url: string; width: number; height: number }[];
  artists: { name: string }[];
  id: string;
  playCount: number;
}

export default function MusicView() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessToken = searchParams.get("access_token");
  const authError = searchParams.get("error");

  const fetchAlbums = useCallback(async (token: string) => {
    console.log("Fetching albums with token:", token.substring(0, 20) + "...");
    try {
      const response = await fetch("/api/spotify/top-albums", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        if (response.status === 401) {
          setError(null);
          return;
        }
        throw new Error(data.error || "Failed to fetch albums");
      }

      setAlbums(data.albums);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      // Store token in sessionStorage for persistence
      sessionStorage.setItem("spotify_access_token", accessToken);
      // Remove token from URL for security
      router.replace("/music");
      // Fetch albums with the token
      fetchAlbums(accessToken);
    } else {
      // Check sessionStorage for existing token
      const storedToken = sessionStorage.getItem("spotify_access_token");
      if (storedToken) {
        fetchAlbums(storedToken);
      } else {
        setLoading(false);
      }
    }
  }, [accessToken, router, fetchAlbums]);

  const handleConnect = () => {
    window.location.href = "/api/spotify/auth";
  };

  if (loading) {
    return (
      <Flex direction="column" gap="24" paddingX="24" paddingY="32">
        <Heading as="h1" size="xl">
          Top Albums
        </Heading>
        <Text onBackground="neutral-medium">Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" gap="24" paddingX="24" paddingY="32">
        <Heading as="h1" size="xl">
          Top Albums
        </Heading>
        <Text onBackground="danger-medium">Error: {error}</Text>
      </Flex>
    );
  }

  // Not authenticated - show connect button
  if (albums.length === 0 || authError) {
    return (
      <Flex direction="column" gap="24" paddingX="24" paddingY="32">
        <Flex direction="column" gap="8">
          <Heading as="h1" size="xl">
            Top Albums
          </Heading>
          <Text onBackground="neutral-medium">
            Connect your Spotify account to see your most played albums this month
          </Text>
        </Flex>

        <Column gap="16" style={{ alignItems: "flex-start" }}>
          <Button prefixIcon="music" onClick={handleConnect}>
            Connect Spotify
          </Button>
          <Text onBackground="neutral-medium" size="xs">
            Your listening data is stored securely and never shared
          </Text>
        </Column>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="24" paddingX="24" paddingY="32">
      <Flex direction="column" gap="8">
        <Heading as="h1" size="xl">
          Top Albums
        </Heading>
        <Text onBackground="neutral-medium">
          My most played albums this month
        </Text>
      </Flex>

      <Flex direction="column" gap="16">
        {albums.map((album, index) => (
          <Flex
            key={album.id}
            gap="16"
            padding="16"
            radius="m"
            style={{
              alignItems: "center",
              background: "var(--static-surface-overlay)",
            }}
          >
            <Flex
              style={{
                position: "relative",
                minWidth: "80px",
                width: "80px",
                height: "80px",
              }}
            >
              <img
                src={album.images[0]?.url ?? "/images/avatar_v2.jpg"}
                alt={album.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <Flex
                position="absolute"
                top="-8px"
                left="-8px"
                width="24px"
                height="24px"
                radius="full"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  background: index === 0 ? "#1DB954" : index === 1 ? "#535353" : "#B3B3B3",
                  color: index === 0 ? "#000" : "#fff",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                {index + 1}
              </Flex>
            </Flex>

            <Column gap="4">
              <Text weight="strong">{album.name}</Text>
              <Text onBackground="neutral-medium" size="s">
                {album.artists.map((a) => a.name).join(", ")}
              </Text>
              <Text onBackground="neutral-medium" size="xs">
                {album.playCount} plays
              </Text>
            </Column>
          </Flex>
        ))}
      </Flex>

      <Text onBackground="neutral-medium" size="xs">
        Data from Spotify • Updated monthly
      </Text>
    </Flex>
  );
}