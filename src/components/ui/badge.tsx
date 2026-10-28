import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700",
        secondary:
          "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200",
        destructive:
          "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
        outline: "text-slate-800 border-slate-200",
        success: "bg-emerald-50 text-emerald-700 border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border-amber-200",
        danger: "bg-rose-50 text-rose-700 border-rose-200",
        info: "bg-sky-50 text-sky-700 border-sky-200",
        neutral: "bg-slate-100 text-slate-700 border-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const dotColors: Record<string, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  destructive: "bg-rose-500",
  info: "bg-sky-500",
  neutral: "bg-slate-400",
  default: "bg-white",
  secondary: "bg-slate-500",
  outline: "bg-slate-500",
};

function Badge({ className, variant = "default", dot = true, children, ...props }: BadgeProps) {
  const currentVariant = variant || "default";
  return (
    <div className={cn(badgeVariants({ variant: currentVariant }), className)} {...props}>
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full", dotColors[currentVariant] || "bg-emerald-500")}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };

