import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getInquiry, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { InquiryStatusActions } from "./InquiryStatusActions";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";

interface InquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InquiryDetailPage({ params }: InquiryDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  const token = session?.accessToken ?? "";

  let inquiry;
  try {
    inquiry = await getInquiry(id, token);
  } catch (err) {
    if (err instanceof ApiError && err.status !== 404) {
      throw err;
    }
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/inquiries"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to inquiries
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Inquiry</h1>
        <Badge variant="secondary" className="ml-2">
          {inquiry.status || "New"}
        </Badge>
      </div>

      <div className="rounded-xl border bg-card divide-y">
        <div className="grid grid-cols-[160px_1fr] gap-x-4 gap-y-3 p-5 text-sm">
          <span className="text-muted-foreground font-medium">Name</span>
          <span className="font-medium">{inquiry.name}</span>

          <span className="text-muted-foreground font-medium">Email</span>
          <a
            href={`mailto:${inquiry.email}`}
            className="text-primary hover:underline"
          >
            {inquiry.email}
          </a>

          <span className="text-muted-foreground font-medium">Phone</span>
          <span>{inquiry.phone ?? "—"}</span>

          <span className="text-muted-foreground font-medium">Item</span>
          <Link
            href={`/admin/items/${inquiry.itemId}`}
            className="text-primary hover:underline"
          >
            View item
          </Link>

          <span className="text-muted-foreground font-medium">Received</span>
          <span className="text-muted-foreground">{formatDate(inquiry.createdAtUtc)}</span>
        </div>

        <div className="p-5 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Message</p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
        </div>

        <div className="p-5">
          <InquiryStatusActions inquiryId={inquiry.id} currentStatus={inquiry.status} />
        </div>
      </div>
    </div>
  );
}
