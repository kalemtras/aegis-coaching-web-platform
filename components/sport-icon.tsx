import { Bike, Droplets, Dumbbell, Footprints, Moon } from 'lucide-react'
import type { Sport } from '@/lib/mock-data'

const map = {
  swim: Droplets,
  bike: Bike,
  run: Footprints,
  strength: Dumbbell,
  rest: Moon,
} as const

export function SportIcon({
  sport,
  className,
}: {
  sport: Sport
  className?: string
}) {
  const Icon = map[sport]
  return <Icon className={className} strokeWidth={2} aria-hidden />
}
