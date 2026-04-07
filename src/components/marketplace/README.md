# Marketplace layer

Marketplace components compose shared UI primitives for public browsing and item interactions.

## Rules

- Keep marketplace/domain logic here (`items`, browse controls, listing cards, public-page sections).
- Consume shared primitives from the UI layer; avoid redefining low-level controls.
- Use semantic tokens only. Theme behavior (light/dark/tenant) must come from token variables, not hardcoded color values.
- Keep components reusable across tenants by avoiding tenant-specific branching in component styling.

## Current runtime note

Existing marketplace components currently live under `components/items`, `components/browse`, and public route modules. This folder establishes the target layer contract for gradual consolidation.
