/** Normalise jsonb/text array columns from Supabase for string arrays. */

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const out: string[] = []
  for (const x of value) {
    if (typeof x === "string" && x.trim()) out.push(x.trim())
  }
  return out
}

export function initialsFromName(name: string | null | undefined): string {
  if (!name?.trim()) return ""
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ""
  const a = parts[0][0]?.toUpperCase() ?? ""
  const b =
    parts.length > 1
      ? parts[parts.length - 1][0]?.toUpperCase() ?? ""
      : ""
  return `${a}${b}`
}
