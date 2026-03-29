"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { AdminAttributeOptionWriteRequest } from "@/types/torget";

type Props = {
  options: AdminAttributeOptionWriteRequest[];
  onChange: (options: AdminAttributeOptionWriteRequest[]) => void;
  errors?: Record<number, string>;
};

export function AdminAttributeOptionsEditor({ options, onChange, errors }: Props) {
  function addOption() {
    onChange([
      ...options,
      { value: "", label: "", sortOrder: (options.length + 1) * 10 },
    ]);
  }

  function removeOption(index: number) {
    onChange(options.filter((_, i) => i !== index));
  }

  function updateOption(index: number, field: keyof AdminAttributeOptionWriteRequest, value: string | number) {
    const updated = options.map((opt, i) =>
      i === index ? { ...opt, [field]: value } : opt
    );
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Enum options</Label>
        <Button type="button" variant="outline" size="sm" onClick={addOption}>
          <Plus className="h-3 w-3 mr-1" />
          Add option
        </Button>
      </div>

      {options.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No options yet. Add at least one option for an Enum attribute.
        </p>
      )}

      <div className="space-y-2">
        {options.map((opt, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1 grid grid-cols-3 gap-2">
              <div>
                {index === 0 && (
                  <Label className="text-xs text-muted-foreground mb-1 block">Value</Label>
                )}
                <Input
                  value={opt.value}
                  onChange={(e) => updateOption(index, "value", e.target.value)}
                  placeholder="e.g. used"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                {index === 0 && (
                  <Label className="text-xs text-muted-foreground mb-1 block">Label</Label>
                )}
                <Input
                  value={opt.label}
                  onChange={(e) => updateOption(index, "label", e.target.value)}
                  placeholder="e.g. Used"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                {index === 0 && (
                  <Label className="text-xs text-muted-foreground mb-1 block">Sort order</Label>
                )}
                <Input
                  type="number"
                  value={opt.sortOrder}
                  onChange={(e) => updateOption(index, "sortOrder", parseInt(e.target.value, 10) || 0)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-8 w-8 text-destructive shrink-0 ${index === 0 ? "mt-5" : ""}`}
              onClick={() => removeOption(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {errors && Object.entries(errors).map(([idx, msg]) => (
        <p key={idx} className="text-xs text-destructive">{msg}</p>
      ))}
    </div>
  );
}
