import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        daisy: "bg-pink-100 text-pink-900 border-pink-200",
        aqua: "bg-cyan-100 text-cyan-900 border-cyan-200",
        lilac: "bg-purple-100 text-purple-900 border-purple-200",
        cherry: "bg-red-100 text-red-900 border-red-200",
        amber: "bg-amber-100 text-amber-900 border-amber-200",
        silver: "bg-gray-100 text-gray-900 border-gray-200",
        lime: "bg-lime-100 text-lime-900 border-lime-200",
        frosted: "bg-white/80 text-gray-900 border-gray-200 backdrop-blur-sm",
        minimal: "bg-transparent text-gray-900 border-gray-200",
      },
    },
    defaultVariants: {
      variant: "silver",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
