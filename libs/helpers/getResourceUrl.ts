import { s3Config } from "../s3";

type ResourceType = "song-cover" | "song-audio" | "song-preview" | "avatar";

export function getResourceUrl(
  url: string | null | undefined,
  resourceType: ResourceType = "avatar"
): string {
  if (!url) return "/assets/images/logos/meduse-icon.png";

  // Si c'est une URL locale (assets)
  if (url.startsWith("/assets/")) {
    return url;
  }

  // Si l'URL contient /null/, on extrait le nom du fichier et l'ID
  if (url.includes("/null/")) {
    const [, fileName] = url.split("/null/");
    if (!fileName) return url;

    // On reconstruit l'URL avec la même structure que l'upload
    switch (resourceType) {
      case "song-cover":
        return `/api/storage/songs/cover-${fileName}`;
      case "song-audio":
        return `/api/storage/songs/full-${fileName}`;
      case "song-preview":
        return `/api/storage/songs/preview-${fileName}`;
      case "avatar":
        return `/api/storage/avatars/${fileName}`;
      default:
        return url;
    }
  }

  return url;
}
