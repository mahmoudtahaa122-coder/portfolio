import type { LucideIcon } from 'lucide-react'
import * as Icons from 'lucide-react'

/** Resolve a Lucide component name saved in Supabase (`icon_name`, `category_icon`, etc.). */
export function portfolioLucideIcon(
  name: string | null | undefined,
  fallback: LucideIcon = Icons.Terminal,
): LucideIcon {
  if (!name?.trim()) return fallback
  const key = name.trim()
  const Icon = (Icons as unknown as Record<string, LucideIcon | undefined>)[key]
  return Icon ?? fallback
}
