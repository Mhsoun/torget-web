"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createInquiry } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InquiryFormProps {
  itemId: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.name.trim()) errors.name = "Name is required.";
  else if (fields.name.length > 200) errors.name = "Name must be 200 characters or fewer.";
  if (!fields.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (fields.phone && fields.phone.length > 30)
    errors.phone = "Phone must be 30 characters or fewer.";
  if (!fields.message.trim()) errors.message = "Message is required.";
  else if (fields.message.length > 2000)
    errors.message = "Message must be 2000 characters or fewer.";
  return errors;
}

export function InquiryForm({ itemId }: InquiryFormProps) {
  const [fields, setFields] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      createInquiry({
        itemId,
        name: fields.name.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim() || undefined,
        message: fields.message.trim(),
      }),
    onSuccess: () => setSubmitted(true),
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    mutation.mutate();
  }

  if (submitted) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center space-y-2">
        <p className="font-semibold text-foreground">Inquiry sent</p>
        <p className="text-sm text-muted-foreground">
          Thank you for your message. We will be in touch with you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <h2 className="text-lg font-semibold">Send an inquiry</h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="inq-name">Name</Label>
          <Input
            id="inq-name"
            name="name"
            value={fields.name}
            onChange={handleChange}
            placeholder="Your name"
            maxLength={200}
            disabled={mutation.isPending}
          />
          {fieldErrors.name && (
            <p className="text-sm text-destructive">{fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="inq-email">Email</Label>
          <Input
            id="inq-email"
            name="email"
            type="email"
            value={fields.email}
            onChange={handleChange}
            placeholder="your@email.com"
            disabled={mutation.isPending}
          />
          {fieldErrors.email && (
            <p className="text-sm text-destructive">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="inq-phone">
            Phone <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="inq-phone"
            name="phone"
            type="tel"
            value={fields.phone}
            onChange={handleChange}
            placeholder="+00 000 00 000"
            disabled={mutation.isPending}
          />
          {fieldErrors.phone && (
            <p className="text-sm text-destructive">{fieldErrors.phone}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="inq-message">Message</Label>
          <Textarea
            id="inq-message"
            name="message"
            value={fields.message}
            onChange={handleChange}
            placeholder="I am interested in this item…"
            rows={4}
            disabled={mutation.isPending}
          />
          {fieldErrors.message && (
            <p className="text-sm text-destructive">{fieldErrors.message}</p>
          )}
        </div>

        {mutation.isError && (
          <p className="text-sm text-destructive">
            Something went wrong. Please try again.
          </p>
        )}

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Sending…" : "Send inquiry"}
        </Button>
      </form>
    </div>
  );
}
