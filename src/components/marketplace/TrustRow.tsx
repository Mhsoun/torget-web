import { Clock3, Eye, ShieldCheck } from "lucide-react";

interface TrustRowProps {
  quickContactText?: string;
  transparencyText?: string;
  reliabilityText?: string;
}

export function TrustRow({
  quickContactText = "Quick contact with sellers",
  transparencyText = "Clear listing information",
  reliabilityText = "Reliable local marketplace flow",
}: TrustRowProps) {
  const items = [
    { icon: Clock3, text: quickContactText },
    { icon: Eye, text: transparencyText },
    { icon: ShieldCheck, text: reliabilityText },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {items.map(({ icon: Icon, text }) => (
        <div
          key={text}
          className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
        >
          <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}
