import * as React from "react";
import { cn } from "@/utils/cn";
import { AlertCircle } from "lucide-react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name;

    return (
      <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            {label}
          </label>
        )}

        <textarea
          id={inputId}
          className={cn(
            "flex min-h-[70px] w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-2xs placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-200"
              : "border-slate-200 hover:border-slate-300 focus-visible:border-emerald-500",
            className
          )}
          ref={ref}
          {...props}
        />

        {error ? (
          <p className="flex items-center gap-1 text-xs text-rose-600 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

