"use client";

import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ItemImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function ItemImage({ src, alt, className }: ItemImageProps) {
  const [broken, setBroken] = useState(false);
  const showPlaceholder = !src || broken;

  if (showPlaceholder) {
    return (
      <div
        className={cn(
          "w-full aspect-[4/3] bg-muted flex items-center justify-center",
          className
        )}
        aria-hidden="true"
      >
        <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      className={cn("w-full aspect-[4/3] object-cover", className)}
    />
  );
}
