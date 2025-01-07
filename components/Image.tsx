import NextImage, { ImageProps as NextImageProps } from "next/image";
import { getResourceUrl } from "@/libs/helpers/getResourceUrl";

type ResourceType = "song-cover" | "song-audio" | "song-preview" | "avatar";

interface ImageProps extends Omit<NextImageProps, "src"> {
  src: string | null | undefined;
  resourceType?: ResourceType;
}

export default function Image({
  src,
  resourceType = "avatar",
  ...props
}: ImageProps) {
  const correctedSrc = getResourceUrl(src, resourceType);
  return <NextImage src={correctedSrc} {...props} />;
}
