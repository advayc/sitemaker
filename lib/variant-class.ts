import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVariantClass(variant: string) {
  const variantClasses = {
    daisy: "bg-pink-100 text-pink-900 border-pink-200",
    aqua: "bg-cyan-100 text-cyan-900 border-cyan-200",
    lilac: "bg-purple-100 text-purple-900 border-purple-200",
    cherry: "bg-red-100 text-red-900 border-red-200",
    amber: "bg-amber-100 text-amber-900 border-amber-200",
    silver: "bg-gray-100 text-gray-900 border-gray-200",
    lime: "bg-lime-100 text-lime-900 border-lime-200",
    frosted: "bg-white/80 text-gray-900 border-gray-200 backdrop-blur-sm",
    minimal: "bg-transparent text-gray-900 border-gray-200",
  }
  return variantClasses[variant as keyof typeof variantClasses] || variantClasses.silver
}
