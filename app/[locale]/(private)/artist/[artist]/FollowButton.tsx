"use client";
import Button from "@/components/ui/Button/Button";
import { followArtist, unfollowArtist } from "@/libs/server/user.action";
import { Follow } from "@prisma/client";
import { useEffect, useState } from "react";

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
      return await followArtist(userId, artistId);
    }

    setFollowing(false);
    return await unfollowArtist(follow.id);
  };

  if (!isClient) return null;

  console.log("following", following);

  return (
    <Button
      onClick={handleFollow}
      color="primary"
      className={`rounded-full text-lg px-7 font-medium ${following ? "opacity-80" : ""}`}
      size="xs"
    >
      {following ? "Suivi" : "Suivre"}
    </Button>
  );
}
