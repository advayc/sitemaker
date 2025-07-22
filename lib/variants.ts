import { cva } from "class-variance-authority"

export const buttonVariants = cva(
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

export const badgeVariants = cva(
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
