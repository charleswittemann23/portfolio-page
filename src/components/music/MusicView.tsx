"use client";

import { Flex, Heading, Text, Column } from "@once-ui-system/core";
import { useEffect, useState } from "react";

interface Album {
  id: string;
  name: string;
  images: { url: string; width: number; height: number }[];
  artists: { name: string }[];
  playCount: number;
}

export default function MusicView() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const response = await fetch("/api/spotify/top-albums-public");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch albums");
        }

        setAlbums(data.albums || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchAlbums();
  }, []);

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
        <Flex direction="column" gap="8">
          <Heading as="h1" size="xl">
            Top Albums
          </Heading>
          <Text onBackground="neutral-medium">
            My most played albums this month
          </Text>
        </Flex>
        <Text onBackground="neutral-medium" size="s">
          {error}
        </Text>
        <Text onBackground="neutral-medium" size="xs">
          To set up Spotify integration,{" "}
          <a href="/api/spotify/setup-auth" style={{ textDecoration: "underline" }}>
            authorize here
          </a>{" "}
          and save the refresh token to your .env.local as SPOTIFY_REFRESH_TOKEN
        </Text>
      </Flex>
    );
  }

  if (!albums || albums.length === 0) {
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
        <Text onBackground="neutral-medium" size="s">
          No albums found.
        </Text>
        <Text onBackground="neutral-medium" size="xs">
          To set up Spotify integration,{" "}
          <a href="/api/spotify/setup-auth" style={{ textDecoration: "underline" }}>
            authorize here
          </a>{" "}
          and save the refresh token to your .env.local as SPOTIFY_REFRESH_TOKEN
        </Text>
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
                radius="full"
                style={{
                  position: "absolute",
                  top: "-8px",
                  left: "-8px",
                  width: "24px",
                  height: "24px",
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
        Data from Spotify • Updated daily
      </Text>
    </Flex>
  );
}