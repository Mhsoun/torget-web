import { Badge } from "@/components/ui/badge";
import {
  ADMIN_CAPABILITIES,
  CapabilityDomain,
  getAdminCapability,
  getCapabilityStateLabel,
  getCapabilityTone,
} from "@/lib/admin/capabilities";

interface AdminCapabilityBadgeProps {
  domain: CapabilityDomain;
}

export function AdminCapabilityBadge({ domain }: AdminCapabilityBadgeProps) {
  const capability = getAdminCapability(domain);
  return (
    <Badge variant={getCapabilityTone(capability.state)}>
      {capability.label}: {getCapabilityStateLabel(capability.state)}
    </Badge>
  );
}

interface AdminCapabilityStatusPanelProps {
  title?: string;
  domains?: CapabilityDomain[];
}

export function AdminCapabilityStatusPanel({
  title = "Backend capability status",
  domains,
}: AdminCapabilityStatusPanelProps) {
  const capabilities = domains
    ? domains.map((domain) => getAdminCapability(domain))
    : Object.values(ADMIN_CAPABILITIES);

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="space-y-2">
        {capabilities.map((capability) => (
          <div key={capability.domain} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{capability.label}</span>
              <Badge variant={getCapabilityTone(capability.state)}>
                {getCapabilityStateLabel(capability.state)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{capability.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
