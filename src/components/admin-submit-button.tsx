"use client";

import { useFormStatus } from "react-dom";

export function AdminSubmitButton({ label, pendingLabel, disabled = false, className, ariaLabel }: { label: string; pendingLabel?: string; disabled?: boolean; className?: string; ariaLabel?: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" className={className} disabled={disabled || pending} aria-label={ariaLabel}>{pending ? pendingLabel ?? "Saving…" : label}</button>;
}
