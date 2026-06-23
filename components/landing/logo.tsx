import { cn } from "@/lib/utils"

interface LumnaLogoProps {
  className?: string
}

export function LumnaLogo({ className }: LumnaLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M10 11C10 10.4477 10.4477 10 11 10H14C14.5523 10 15 10.4477 15 11V21C15 21.5523 14.5523 22 14 22H11C10.4477 22 10 21.5523 10 21V11Z"
        fill="white"
      />
      <path
        d="M17 14C17 13.4477 17.4477 13 18 13H21C21.5523 13 22 13.4477 22 14V21C22 21.5523 21.5523 22 21 22H18C17.4477 22 17 21.5523 17 21V14Z"
        fill="white"
      />
      <circle cx="19.5" cy="11.5" r="1.5" fill="white" />
    </svg>
  )
}
