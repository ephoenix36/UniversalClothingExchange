import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground border border-secondary/20",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive/20",
        outline: "text-foreground border border-input",
        success:
          "bg-success text-success-foreground border border-success/20",
        warning:
          "bg-warning text-warning-foreground border border-warning/20",
        info:
          "bg-accent text-accent-foreground border border-accent/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
