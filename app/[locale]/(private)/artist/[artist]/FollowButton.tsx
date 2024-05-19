"use client";
import Button from "@/components/ui/Button/Button";
import { followArtist, unfollowArtist } from "@/libs/server/user.action";
import { Follow } from "@prisma/client";
import { useEffect, useState } from "react";
import { revalidateArtist } from "./revalidate.action";

export function FollowButton({
  userId,
  artistId,
  follow
}: {
  userId: string;
  artistId: string;
  follow?: Follow;
}) {
  const [following, setFollowing] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setFollowing(follow?.id ? true : false);
  }, [follow]);

  const handleFollow = async () => {
    if (!following) {
      setFollowing(true);
      await followArtist(userId, artistId);
      return revalidateArtist(artistId);
    }

    setFollowing(false);
    await unfollowArtist(follow.id);
    return revalidateArtist(artistId);
  };

  if (!isClient) return null;

  console.log("following", following);

  return (
    <Button
      onClick={handleFollow}
      className={`rounded-full text-lg px-7 font-medium ${!following ? "btn-outline" : "!btn-outline !bg-primary !text-muted"} `}
      size="xs"
    >
      {following ? "Suivi" : "Suivre"}
    </Button>
  );
}
