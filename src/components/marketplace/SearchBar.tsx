"use client";

import { Search } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

interface SearchBarProps {
  value: string;
  onValueChange: (next: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onValueChange,
  onSubmit,
  placeholder = "Search listings",
}: SearchBarProps) {
  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-card p-2">
      <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className="border-0 bg-transparent shadow-none focus-visible:ring-0"
      />
      {onSubmit ? (
        <Button onClick={onSubmit} variant="default" size="sm">
          Search
        </Button>
      ) : null}
    </div>
  );
}
