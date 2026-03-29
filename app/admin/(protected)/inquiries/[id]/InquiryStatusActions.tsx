"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { patchInquiryStatus } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { INQUIRY_STATUSES } from "@/types/torget";

interface InquiryStatusActionsProps {
  inquiryId: string;
  currentStatus: string;
}

export function InquiryStatusActions({ inquiryId, currentStatus }: InquiryStatusActionsProps) {
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";
  const router = useRouter();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (status: string) => patchInquiryStatus(inquiryId, { status }, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
      router.refresh();
    },
  });

  const otherStatuses = INQUIRY_STATUSES.filter((s) => s !== currentStatus);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Change status</p>
      <div className="flex gap-2 flex-wrap">
        {otherStatuses.map((s) => (
          <Button
            key={s}
            size="sm"
            variant="outline"
            onClick={() => mutation.mutate(s)}
            disabled={mutation.isPending}
          >
            {s}
          </Button>
        ))}
      </div>
      {mutation.isError && (
        <p className="text-sm text-destructive">Failed to update status. Please try again.</p>
      )}
    </div>
  );
}
