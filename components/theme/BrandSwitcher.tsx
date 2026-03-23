"use client";

import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface BrandSwitcherProps {
  /** Additional class names on the trigger */
  className?: string;
}

/**
 * A dropdown that lets the user switch between registered brand themes.
 *
 * Intended for admin panels, dev toolbars, and white-label demos.
 * Not required in production single-brand deployments.
 */
export function BrandSwitcher({ className }: BrandSwitcherProps) {
  const { brand, brandId, setBrand, availableBrands } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        aria-label="Switch brand theme"
      >
        <Palette className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span>{brand.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Brand theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableBrands.map((b) => (
          <DropdownMenuItem
            key={b.id}
            onClick={() => setBrand(b.id)}
            className={cn(
              "flex items-center justify-between",
              b.id === brandId && "text-primary font-medium"
            )}
          >
            <span>{b.name}</span>
            {b.id === brandId && (
              <span className="text-xs text-muted-foreground">active</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
