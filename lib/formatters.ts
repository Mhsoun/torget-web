import { ItemStatus } from "@/types/torget";

export function formatPrice(
  amount: number,
  locale = "nb-NO",
  currency = "NOK"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string, locale = "en-GB"): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(iso)
  );
}

export function statusBadgeVariant(
  status: ItemStatus
): "default" | "secondary" | "success" {
  switch (status) {
    case ItemStatus.Active:
      return "default";
    case ItemStatus.Sold:
      return "success";
    default:
      return "secondary";
  }
}
