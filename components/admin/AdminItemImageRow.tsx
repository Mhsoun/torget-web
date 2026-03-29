"use client";

import { ItemImage } from "@/components/items/ItemImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ItemImageResponse } from "@/types/torget";
import { PencilIcon, StarIcon, Trash2Icon } from "lucide-react";

interface AdminItemImageRowProps {
  image: ItemImageResponse;
  altFallback: string;
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetPrimary: () => void;
}

export function AdminItemImageRow({
  image,
  altFallback,
  disabled,
  onEdit,
  onDelete,
  onSetPrimary,
}: AdminItemImageRowProps) {
  return (
    <div
      className={`flex gap-4 rounded-lg border border-border bg-card p-3 transition-opacity ${
        disabled ? "opacity-60 pointer-events-none" : ""
      } ${image.isPrimary ? "ring-1 ring-primary/30" : ""}`}
    >
      <div className="w-28 shrink-0 overflow-hidden rounded-md ring-1 ring-foreground/10">
        <ItemImage
          src={image.url}
          alt={image.altText ?? altFallback}
          className="aspect-[4/3] rounded-md"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          {image.isPrimary && (
            <Badge variant="default" className="text-xs">
              Primary
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">Order {image.sortOrder}</span>
        </div>
        <p className="truncate font-mono text-xs text-foreground" title={image.url}>
          {image.url}
        </p>
        {image.altText ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">{image.altText}</p>
        ) : (
          <p className="text-xs italic text-muted-foreground">No alt text</p>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          {!image.isPrimary && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSetPrimary}
              disabled={disabled}
            >
              <StarIcon className="size-3.5" />
              Set primary
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onEdit}
            disabled={disabled}
          >
            <PencilIcon className="size-3.5" />
            Edit
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={disabled}
          >
            <Trash2Icon className="size-3.5" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
