"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { memo } from "react";

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  // classNameError?: string;
  className?: string;
  srcError?: string;
};

const ImageWithFallback = memo(function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  // classNameError,
  srcError = "/assets/images/logos/logo.png"
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  // if (hasError) {
  //   return (
  //     <div
  //       className={`absolute inset-0 bg-gray-500/30 flex items-center justify-center ${classNameError}`}
  //     >
  //       {/* <p className="text-white">Image indisponible</p> */}
  //     </div>
  //   );
  // }

  return (
    <Image
      className={`object-cover rounded-md ${className}`}
      alt={alt}
      src={hasError ? srcError : src}
      width={width}
      height={height}
      fill={fill}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4dHRsdHR4dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshIRshHRkdIR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      onError={handleError}
    />
  );
});

// Optionnel : ajouter un displayName pour le debugging
ImageWithFallback.displayName = "ImageWithFallback";

export default ImageWithFallback;
