"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminAttributeDefinitionResponse } from "@/types/torget";

interface AdminItemAttributesSectionProps {
  definitions: AdminAttributeDefinitionResponse[];
  values: Record<string, string | undefined>;
  errors: Record<string, string>;
  isLoading: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
  onChange: (attributeId: string, value: string) => void;
}

export function AdminItemAttributesSection({
  definitions,
  values,
  errors,
  isLoading,
  errorMessage,
  disabled,
  onChange,
}: AdminItemAttributesSectionProps) {
  return (
    <section className="space-y-4 border-t pt-6">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Attributes
        </h2>
        <p className="text-sm text-muted-foreground">
          Dynamic item properties are generated from the shared attribute definitions.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-9 w-full animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && definitions.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          No attributes are defined yet for items.
        </div>
      )}

      {!isLoading && !errorMessage && definitions.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {definitions.map((definition) => {
            const value = values[definition.id] ?? "";
            const fieldId = `attribute-${definition.id}`;
            const fieldError = errors[definition.id];

            return (
              <div key={definition.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor={fieldId}>{definition.name}</Label>
                  <span className="text-xs text-muted-foreground">
                    {definition.isRequired ? "Required" : "Optional"}
                  </span>
                </div>

                {definition.type === "Enum" ? (
                  <Select
                    value={value || "none"}
                    onValueChange={(next) => {
                      const normalized = next ?? "none";
                      onChange(definition.id, normalized === "none" ? "" : normalized);
                    }}
                    disabled={disabled}
                  >
                    <SelectTrigger id={fieldId} aria-invalid={!!fieldError}>
                      <SelectValue placeholder={`Select ${definition.name.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No value</SelectItem>
                      {definition.options.map((option) => (
                        <SelectItem key={option.id} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : definition.type === "Bool" ? (
                  <Select
                    value={value || "none"}
                    onValueChange={(next) => {
                      const normalized = next ?? "none";
                      onChange(definition.id, normalized === "none" ? "" : normalized);
                    }}
                    disabled={disabled}
                  >
                    <SelectTrigger id={fieldId} aria-invalid={!!fieldError}>
                      <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No value</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={fieldId}
                    type={definition.type === "Number" ? "number" : "text"}
                    value={value}
                    onChange={(event) => onChange(definition.id, event.target.value)}
                    disabled={disabled}
                    aria-invalid={!!fieldError}
                    autoComplete="off"
                  />
                )}

                <p className="text-xs text-muted-foreground">
                  {definition.slug}
                </p>
                {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
