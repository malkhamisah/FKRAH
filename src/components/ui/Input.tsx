import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldBase =
  "w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 " +
  "placeholder:text-ink-400 transition-colors " +
  "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 " +
  "disabled:cursor-not-allowed disabled:bg-ink-50";

function Label({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-700">
      {children}
      {hint && <span className="ms-1 font-normal text-ink-400">({hint})</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-danger-600">{message}</p>;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    return (
      <div>
        {label && (
          <Label htmlFor={fieldId} hint={hint}>
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={fieldId}
          className={cn(fieldBase, error && "border-danger-500", className)}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        <FieldError message={error} />
      </div>
    );
  },
);
Input.displayName = "Input";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    return (
      <div>
        {label && (
          <Label htmlFor={fieldId} hint={hint}>
            {label}
          </Label>
        )}
        <textarea
          ref={ref}
          id={fieldId}
          className={cn(fieldBase, "min-h-24 resize-y", error && "border-danger-500", className)}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        <FieldError message={error} />
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    return (
      <div>
        {label && <Label htmlFor={fieldId}>{label}</Label>}
        <select
          ref={ref}
          id={fieldId}
          className={cn(fieldBase, "cursor-pointer", error && "border-danger-500", className)}
          {...props}
        >
          {children}
        </select>
        <FieldError message={error} />
      </div>
    );
  },
);
Select.displayName = "Select";
