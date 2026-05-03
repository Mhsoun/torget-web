"use client";

import type { ReactNode } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { getApiErrorUiState } from "@/lib/api";

interface AdminPageLoadingProps {
  message?: string;
}

export function AdminPageLoading({ message = "Loading…" }: AdminPageLoadingProps) {
  return (
    <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{message}</span>
    </div>
  );
}

interface AdminEmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function AdminEmptyState({ title, description, action }: AdminEmptyStateProps) {
  return (
    <div className="rounded-lg border bg-card p-8 text-center space-y-2">
      <p className="font-medium">{title}</p>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}

interface AdminErrorPanelProps {
  error: unknown;
  onRetry?: () => void;
  onSignIn?: () => void;
  titleOverride?: string;
  className?: string;
}

export function AdminErrorPanel({
  error,
  onRetry,
  onSignIn,
  titleOverride,
  className,
}: AdminErrorPanelProps) {
  const ui = getApiErrorUiState(error);
  const title = titleOverride ?? ui.title;
  const canRetry = ui.action === "retry" && !!onRetry;
  const canSignIn = ui.action === "sign_in" && !!onSignIn;

  return (
    <div className={`rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive ${className ?? ""}`}>
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-destructive/90">{ui.message}</p>
      {(canRetry || canSignIn) && (
        <div className="mt-3">
          {canRetry ? (
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Retry
            </Button>
          ) : null}
          {canSignIn ? (
            <Button type="button" variant="outline" size="sm" onClick={onSignIn}>
              Sign in
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}

interface AdminTableStateRowProps {
  colSpan: number;
  variant: "loading" | "error" | "empty";
  text: string;
  retry?: () => void;
}

export function AdminTableStateRow({ colSpan, variant, text, retry }: AdminTableStateRowProps) {
  const textClass = variant === "error" ? "text-destructive" : "text-muted-foreground";
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className={`py-8 text-center ${textClass}`}>
        <div className="flex flex-col items-center gap-2">
          {variant === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          <span>{text}</span>
          {variant === "error" && retry ? (
            <Button type="button" variant="outline" size="sm" onClick={retry}>
              Retry
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}

interface AdminPendingHintProps {
  show: boolean;
  text?: string;
}

export function AdminPendingHint({ show, text = "Saving…" }: AdminPendingHintProps) {
  if (!show) {
    return null;
  }
  return (
    <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
      <Loader2 className="h-3 w-3 animate-spin" />
      {text}
    </p>
  );
}
