# UI layer

This folder is the contract for shared, app-level UI primitives.

## Rules

- Use semantic design tokens (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.).
- Keep components domain-agnostic (no marketplace-specific copy or business logic).
- Prefer shadcn/ui patterns and primitives; use Radix primitives where interaction patterns require low-level control.
- Do not hardcode tenant colors in component code. Tenant branding is applied through token layers.

## Current runtime note

The existing runtime primitives still live in `components/ui` during this incremental migration. New shared UI work should follow the same token-first rules and can be moved under `src/components/ui` as the migration advances.
