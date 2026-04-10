import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface UserAvatarProps {
  name: string
  image?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function getColorFromName(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hues = [275, 163, 255, 68, 330, 200, 30, 140]
  const hue = hues[Math.abs(hash) % hues.length]

  return {
    bg: `oklch(0.92 0.04 ${hue})`,
    text: `oklch(0.45 0.15 ${hue})`,
  }
}

export function UserAvatar({ name, image, size = "md", className }: UserAvatarProps) {
  const initials = getInitials(name)
  const colors = getColorFromName(name)

  return (
    <Avatar>
      <AvatarImage src={image} alt={name} />
      <AvatarFallback
        className={cn(
          "flex items-center justify-center font-medium",
          className
        )}
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
