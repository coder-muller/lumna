import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const iconSizes = { sm: 14, md: 18, lg: 22 }
  const textSizes = { sm: "text-sm", md: "text-base", lg: "text-lg" }
  const containerSizes = { sm: "p-1", md: "p-1.5", lg: "p-2" }

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary/10",
          containerSizes[size]
        )}
      >
        <Zap size={iconSizes[size]} className="fill-primary text-primary" />
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight text-foreground",
            textSizes[size]
          )}
        >
          Lumna
        </span>
      )}
    </div>
  )
}
