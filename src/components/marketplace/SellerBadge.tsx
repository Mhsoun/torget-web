import { ShieldCheck } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";

interface SellerBadgeProps {
  sellerLabel?: string;
  verified?: boolean;
}

export function SellerBadge({
  sellerLabel = "Local seller",
  verified = false,
}: SellerBadgeProps) {
  return (
    <Badge
      variant={verified ? "default" : "secondary"}
      className="inline-flex items-center gap-1"
    >
      {verified ? <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> : null}
      <span>{sellerLabel}</span>
    </Badge>
  );
}
