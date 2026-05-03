"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { patchInquiryStatus } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { INQUIRY_STATUSES } from "@/types/torget";
import { useAdminAccessToken } from "@/hooks/useAdminAccessToken";
import { AdminErrorPanel, AdminPendingHint } from "@/components/admin/state";

interface InquiryStatusActionsProps {
  inquiryId: string;
  currentStatus: string;
}

export function InquiryStatusActions({ inquiryId, currentStatus }: InquiryStatusActionsProps) {
  const { token, callbackUrl } = useAdminAccessToken();
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
      <AdminPendingHint show={mutation.isPending} text="Updating status…" />
      {mutation.isError ? (
        <AdminErrorPanel
          error={mutation.error}
          titleOverride="Failed to update status"
          onSignIn={() => window.location.assign(`/admin/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)}
        />
      ) : null}
    </div>
  );
}
