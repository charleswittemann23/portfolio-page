import { Flex, Meta, Schema } from "@once-ui-system/core";
import { baseURL, person } from "@/resources";
import MusicView from "@/components/music/MusicView";

export async function generateMetadata() {
  return Meta.generate({
    title: "Music",
    description: `${person.name}'s top albums from Spotify`,
    baseURL: baseURL,
    image: `/api/og/generate?title=Music`,
    path: "/music",
  });
}

export default function Music() {
  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title="Music"
        description={`${person.name}'s top albums from Spotify`}
        path="/music"
        image={`/api/og/generate?title=Music`}
        author={{
          name: person.name,
          url: `${baseURL}/music`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <MusicView />
    </Flex>
  );
}