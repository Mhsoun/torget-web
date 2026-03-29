"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { AdminAttributeOptionsEditor } from "./AdminAttributeOptionsEditor";
import type {
  AdminAttributeDefinitionResponse,
  AdminAttributeDefinitionWriteRequest,
  AdminAttributeOptionWriteRequest,
} from "@/types/torget";

const ATTRIBUTE_TYPES = ["Text", "Number", "Enum", "Bool"] as const;

const optionSchema = z.object({
  value: z.string().min(1, "Value is required"),
  label: z.string().min(1, "Label is required"),
  sortOrder: z.number().int(),
});

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  type: z.enum(["Text", "Number", "Enum", "Bool"]),
  isRequired: z.boolean(),
  isSearchable: z.boolean(),
  sortOrder: z.number().int().min(0),
  options: z.array(optionSchema),
}).superRefine((data, ctx) => {
  if (data.type === "Enum") {
    if (data.options.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enum attributes must have at least one option", path: ["options"] });
    }
    const values = data.options.map(o => o.value.toLowerCase());
    const duplicates = values.filter((v, i) => values.indexOf(v) !== i);
    if (duplicates.length > 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Duplicate option values: ${[...new Set(duplicates)].join(", ")}`, path: ["options"] });
    }
  } else if (data.options.length > 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Options are only allowed for Enum attributes", path: ["options"] });
  }
});

type FormValues = z.infer<typeof schema>;

type Props = {
  definition?: AdminAttributeDefinitionResponse;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (data: AdminAttributeDefinitionWriteRequest) => Promise<void>;
  onCancel: () => void;
};

export function AdminAttributeDefinitionForm({
  definition,
  isSubmitting,
  submitLabel = "Save",
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      type: "Text",
      isRequired: false,
      isSearchable: false,
      sortOrder: 10,
      options: [],
    },
  });

  useEffect(() => {
    if (definition) {
      reset({
        name: definition.name,
        slug: definition.slug,
        type: definition.type as "Text" | "Number" | "Enum" | "Bool",
        isRequired: definition.isRequired,
        isSearchable: definition.isSearchable,
        sortOrder: definition.sortOrder,
        options: definition.options.map(o => ({
          value: o.value,
          label: o.label,
          sortOrder: o.sortOrder,
        })),
      });
    }
  }, [definition, reset]);

  const watchedType = watch("type");
  const watchedOptions = watch("options");

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  async function submit(values: FormValues) {
    await onSubmit({
      name: values.name,
      slug: values.slug,
      type: values.type,
      isRequired: values.isRequired,
      isSearchable: values.isSearchable,
      sortOrder: values.sortOrder,
      options: values.type === "Enum" ? values.options : [],
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="def-name">Name</Label>
          <Input
            id="def-name"
            {...register("name", {
              onChange: (e) => {
                if (!definition) {
                  setValue("slug", autoSlug(e.target.value), { shouldValidate: false });
                }
              },
            })}
            placeholder="e.g. Condition"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="def-slug">Slug</Label>
          <Input
            id="def-slug"
            {...register("slug")}
            placeholder="e.g. condition"
          />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="def-type">Type</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  if (v !== "Enum") setValue("options", []);
                }}
              >
                <SelectTrigger id="def-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ATTRIBUTE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="def-sort">Sort order</Label>
          <Input
            id="def-sort"
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
          />
          {errors.sortOrder && <p className="text-xs text-destructive">{errors.sortOrder.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" {...register("isRequired")} className="h-4 w-4 rounded" />
          <span className="text-sm">Required</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" {...register("isSearchable")} className="h-4 w-4 rounded" />
          <span className="text-sm">Searchable</span>
        </label>
      </div>

      {watchedType === "Enum" && (
        <div className="rounded-md border p-4 space-y-3">
          <Controller
            name="options"
            control={control}
            render={({ field }) => (
              <AdminAttributeOptionsEditor
                options={field.value as AdminAttributeOptionWriteRequest[]}
                onChange={field.onChange}
              />
            )}
          />
          {errors.options && !Array.isArray(errors.options) && (
            <p className="text-xs text-destructive">{(errors.options as { message?: string }).message}</p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
