# Frontend Readiness Optional Page Assessment

This assessment is completed after robustness batches (auth/guard, API hardening, async-state primitives, capability UX, admin rollout).

## Optional page review

### 1) Admin orders detail page
- **Decision:** Defer for now.
- **Reason:** Orders backend is currently read-only/partial in practice; status mutation paths are not reliably available end-to-end yet.
- **Current value:** Low immediate operator/testing value beyond existing list + explicit read-only capability messaging.

### 2) Admin leads detail page
- **Decision:** Defer for now.
- **Reason:** Leads backend is currently read-only/partial with limited actionable workflow.
- **Current value:** Low immediate operator/testing value while lifecycle operations remain incomplete.

### 3) Operational diagnostics page
- **Decision:** Defer for now.
- **Reason:** We already expose capability status directly in admin UX and standardized error/retry patterns across key screens.
- **Current value:** Additional diagnostics page would duplicate existing readiness signals and can be added once backend contracts stabilize.

## Trigger to revisit

Reassess these pages when backend capability states improve:
- Orders transitions become fully supported and stable
- Leads lifecycle/actions are implemented
- Additional operator telemetry needs emerge beyond current capability/status surfaces
