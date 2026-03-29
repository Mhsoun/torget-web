"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminAttributes,
  getAdminItemAttributes,
} from "@/lib/api";
import { AdminItemAttributesSection } from "@/components/admin/AdminItemAttributesSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  AdminItemAttributesUpdateRequest,
  CategoryResponse,
  ItemDetailResponse,
  ItemStatus,
  ItemWriteRequest,
} from "@/types/torget";
import { ITEM_STATUS_LABELS } from "@/types/torget";

const ITEM_STATUS_OPTIONS = [0, 1, 2, 3] as ItemStatus[];

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  price: z.coerce.number().positive("Price must be positive"),
  description: z.string().max(2000, "Description must be 2000 characters or fewer").optional(),
  categoryId: z.string().optional(),
  status: z.number(),
  attributes: z.record(z.string(), z.string()).default({}),
});

export type AdminItemFormValues = z.infer<typeof schema>;

export type AdminItemFormSubmitData = {
  item: ItemWriteRequest;
  attributes: AdminItemAttributesUpdateRequest;
};

interface AdminItemFormProps {
  item?: ItemDetailResponse;
  itemId?: string;
  categories: CategoryResponse[];
  token: string;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (data: AdminItemFormSubmitData) => Promise<void>;
  onCancel?: () => void;
}

export function AdminItemForm({
  item,
  itemId,
  categories,
  token,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
}: AdminItemFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attributeErrors, setAttributeErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminItemFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<AdminItemFormValues>,
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      categoryId: undefined,
      status: 0,
      attributes: {},
    },
  });

  const { data: definitions = [], isLoading: isDefinitionsLoading, error: definitionsError } = useQuery({
    queryKey: ["admin-attributes"],
    queryFn: () => getAdminAttributes(token),
    enabled: !!token,
  });

  const {
    data: existingValues = [],
    isLoading: isValuesLoading,
    error: valuesError,
  } = useQuery({
    queryKey: ["admin-item-attributes", itemId],
    queryFn: () => getAdminItemAttributes(itemId!, token),
    enabled: !!token && !!itemId,
  });

  const existingValueMap = useMemo(
    () =>
      Object.fromEntries(existingValues.map((value) => [value.attributeId, value.value])),
    [existingValues]
  );

  useEffect(() => {
    if (itemId && isValuesLoading) {
      return;
    }

    reset({
      name: item?.name ?? "",
      price: item?.price ?? 0,
      description: item?.description ?? "",
      categoryId: item?.categoryId ?? undefined,
      status: item?.status ?? 0,
      attributes: itemId ? existingValueMap : {},
    });
    setSubmitError(null);
    setAttributeErrors({});
  }, [item, itemId, isValuesLoading, existingValueMap, reset]);

  const statusValue = watch("status") as ItemStatus;
  const categoryIdValue = watch("categoryId") as string | undefined;
  const attributeValues = (watch("attributes") ?? {}) as Record<string, string | undefined>;

  async function submit(values: AdminItemFormValues) {
    setSubmitError(null);
    const nextAttributeErrors: Record<string, string> = {};

    const attributes = definitions
      .map((definition) => {
        const rawValue = values.attributes?.[definition.id];
        const raw = typeof rawValue === "string" ? rawValue.trim() : "";

        if (!raw) {
          if (definition.isRequired) {
            nextAttributeErrors[definition.id] = `${definition.name} is required.`;
          }

          return null;
        }

        if (definition.type === "Enum" && !definition.options.some((option) => option.value === raw)) {
          nextAttributeErrors[definition.id] = "Select a valid option.";
          return null;
        }

        if (definition.type === "Bool" && raw !== "true" && raw !== "false") {
          nextAttributeErrors[definition.id] = "Choose Yes or No.";
          return null;
        }

        if (definition.type === "Number" && Number.isNaN(Number(raw))) {
          nextAttributeErrors[definition.id] = "Enter a valid number.";
          return null;
        }

        return {
          attributeId: definition.id,
          value: raw,
        };
      })
      .filter((attribute): attribute is { attributeId: string; value: string } => attribute !== null);

    setAttributeErrors(nextAttributeErrors);
    if (Object.keys(nextAttributeErrors).length > 0) {
      return;
    }

    try {
      await onSubmit({
        item: {
          name: values.name.trim(),
          price: values.price,
          description: values.description?.trim() || undefined,
          categoryId: values.categoryId,
          status: values.status as ItemStatus,
        },
        attributes: {
          attributes,
        },
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not save the item.");
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {submitError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Core fields
          </h2>
          <p className="text-sm text-muted-foreground">
            Basic listing details shown throughout the marketplace and admin views.
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="item-name">Name</Label>
          <Input id="item-name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="item-price">Price (NOK)</Label>
            <Input
              id="item-price"
              type="number"
              step="0.01"
              {...register("price")}
              aria-invalid={!!errors.price}
            />
            {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={String(statusValue)}
              onValueChange={(value) => setValue("status", Number(value), { shouldDirty: true })}
              disabled={isSubmitting}
            >
              <SelectTrigger aria-invalid={!!errors.status}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEM_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={String(status)}>
                    {ITEM_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label>Category</Label>
          <Select
            value={categoryIdValue ?? "none"}
            onValueChange={(value) =>
              setValue("categoryId", value === "none" || value == null ? undefined : value, {
                shouldDirty: true,
              })
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="item-description">Description</Label>
          <Textarea
            id="item-description"
            rows={5}
            {...register("description")}
            placeholder="Describe condition, dimensions, usage, pickup details, or anything else buyers should know."
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>
      </section>

      <AdminItemAttributesSection
        definitions={definitions}
        values={attributeValues}
        errors={attributeErrors}
        isLoading={isDefinitionsLoading || (!!itemId && isValuesLoading)}
        errorMessage={
          definitionsError instanceof Error
            ? definitionsError.message
            : valuesError instanceof Error
              ? valuesError.message
              : null
        }
        disabled={isSubmitting}
        onChange={(attributeId, value) => {
          setValue(`attributes.${attributeId}`, value, { shouldDirty: true });
          setAttributeErrors((current) => {
            if (!current[attributeId]) {
              return current;
            }

            const next = { ...current };
            delete next[attributeId];
            return next;
          });
        }}
      />

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting || isDefinitionsLoading || (!!itemId && isValuesLoading)}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
