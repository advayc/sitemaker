import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        daisy: "bg-pink-100 text-pink-900 shadow hover:bg-pink-200 border border-pink-200",
        aqua: "bg-cyan-100 text-cyan-900 shadow hover:bg-cyan-200 border border-cyan-200",
        lilac: "bg-purple-100 text-purple-900 shadow hover:bg-purple-200 border border-purple-200",
        cherry: "bg-red-100 text-red-900 shadow hover:bg-red-200 border border-red-200",
        amber: "bg-amber-100 text-amber-900 shadow hover:bg-amber-200 border border-amber-200",
        silver: "bg-gray-100 text-gray-900 shadow hover:bg-gray-200 border border-gray-200",
        lime: "bg-lime-100 text-lime-900 shadow hover:bg-lime-200 border border-lime-200",
        frosted: "bg-white/80 text-gray-900 shadow hover:bg-white/90 border border-gray-200 backdrop-blur-sm",
        minimal: "bg-transparent text-gray-900 hover:bg-gray-100 border border-gray-200",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "silver",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
