"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminBusinessConfig, upsertBusinessConfig } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import type { BusinessConfigWriteRequest } from "@/types/torget";
import { useAdminAccessToken } from "@/hooks/useAdminAccessToken";
import { AdminCapabilityBadge } from "@/components/admin/capabilities";
import { AdminErrorPanel, AdminPageLoading, AdminPendingHint } from "@/components/admin/state";

const EMPTY_FORM: BusinessConfigWriteRequest = {
  name: "",
  tagline: "",
  slug: "",
  locale: "",
  currency: "",
  brandKey: "",
  contactEmail: "",
  showInquiries: true,
  showPrices: true,
  showCategories: true,
};

export default function BusinessSettingsPage() {
  const { token, isSessionLoading, isAuthenticated, callbackUrl } = useAdminAccessToken();
  const qc = useQueryClient();

  const [form, setForm] = useState<BusinessConfigWriteRequest>(EMPTY_FORM);
  const [saved, setSaved] = useState(false);

  const { data: config, isLoading, isError: isConfigError } = useQuery({
    queryKey: ["business-config"],
    queryFn: () => getAdminBusinessConfig(token),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (config) {
      setForm({
        name: config.name,
        tagline: config.tagline ?? "",
        slug: config.slug,
        locale: config.locale,
        currency: config.currency,
        brandKey: config.brandKey,
        contactEmail: config.contactEmail ?? "",
        showInquiries: config.features.showInquiries,
        showPrices: config.features.showPrices,
        showCategories: config.features.showCategories,
      });
    }
  }, [config]);

  const mutation = useMutation({
    mutationFn: () => upsertBusinessConfig(form, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["business-config"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const setField = <K extends keyof BusinessConfigWriteRequest>(
    key: K,
    value: BusinessConfigWriteRequest[K],
  ) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (isSessionLoading || isLoading) {
    return <AdminPageLoading message="Loading settings…" />;
  }

  if (isConfigError) {
    return (
      <AdminErrorPanel
        error={new Error("Failed to load settings.")}
        onSignIn={() => window.location.assign(`/admin/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)}
      />
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Business Settings</h1>
        <AdminCapabilityBadge domain="business_config" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
          <CardDescription>Public-facing name and branding for this site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="My Marketplace"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={form.tagline ?? ""}
              onChange={(e) => setField("tagline", e.target.value)}
              placeholder="Buy and sell anything"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value)}
                placeholder="my-marketplace"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brandKey">Brand Key *</Label>
              <Input
                id="brandKey"
                value={form.brandKey}
                onChange={(e) => setField("brandKey", e.target.value)}
                placeholder="default"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={form.contactEmail ?? ""}
              onChange={(e) => setField("contactEmail", e.target.value)}
              placeholder="hello@example.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Locale &amp; Currency</CardTitle>
          <CardDescription>Regional settings for formatting and display.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="locale">Locale *</Label>
            <Input
              id="locale"
              value={form.locale}
              onChange={(e) => setField("locale", e.target.value)}
              placeholder="en"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="currency">Currency *</Label>
            <Input
              id="currency"
              value={form.currency}
              onChange={(e) => setField("currency", e.target.value)}
              placeholder="USD"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>Toggle which features are visible on the public site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-3">
            <input
              id="showInquiries"
              type="checkbox"
              checked={form.showInquiries}
              onChange={(e) => setField("showInquiries", e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <div>
              <Label htmlFor="showInquiries" className="text-sm font-medium cursor-pointer">
                Show Inquiries
              </Label>
              <p className="text-xs text-muted-foreground">Display inquiry form on item pages</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="showPrices"
              type="checkbox"
              checked={form.showPrices}
              onChange={(e) => setField("showPrices", e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <div>
              <Label htmlFor="showPrices" className="text-sm font-medium cursor-pointer">
                Show Prices
              </Label>
              <p className="text-xs text-muted-foreground">Display item prices on listings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="showCategories"
              type="checkbox"
              checked={form.showCategories}
              onChange={(e) => setField("showCategories", e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <div>
              <Label htmlFor="showCategories" className="text-sm font-medium cursor-pointer">
                Show Categories
              </Label>
              <p className="text-xs text-muted-foreground">Display category navigation on public site</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !form.name || !form.slug || !form.locale || !form.currency || !form.brandKey}
        >
          {mutation.isPending ? "Saving…" : "Save Settings"}
        </Button>

        {saved && (
          <p className="text-sm text-green-600">Settings saved successfully.</p>
        )}
        <AdminPendingHint show={mutation.isPending} text="Saving settings…" />
      </div>
      {mutation.isError ? (
        <AdminErrorPanel
          error={mutation.error}
          titleOverride="Failed to save settings"
          onSignIn={() => window.location.assign(`/admin/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)}
        />
      ) : null}
    </div>
  );
}
