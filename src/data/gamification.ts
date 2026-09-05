import type { RankDef } from './types'

export const RANKS: RankDef[] = [
  { id: 'beginner', title: 'Начинающий исследователь', icon: '🌱', minXp: 0 },
  { id: 'tracker', title: 'Береговой следопыт', icon: '🐚', minXp: 150 },
  { id: 'keeper', title: 'Хранитель дюн', icon: '🏖️', minXp: 400 },
  { id: 'guardian', title: 'Страж Чистого берега', icon: '⚓', minXp: 750 },
  { id: 'captain', title: 'Капитан берега', icon: '🧭', minXp: 1200 },
  { id: 'legend', title: 'Легенда Чистого берега', icon: '🌟', minXp: 1900 },
]

export function rankForXp(xp: number): RankDef {
  let current = RANKS[0]
  for (const rank of RANKS) {
    if (xp >= rank.minXp) current = rank
    else break
  }
  return current
}

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3300, 4000, 4800, 5700, 6700,
]

export function levelForXp(xp: number): number {
  let level = 1
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 1; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i
      break
    }
  }
  return level
}

export interface LevelSpan {
  level: number
  current: number
  base: number
  next: number
  progress: number
  remaining: number
}

export function levelSpan(xp: number): LevelSpan {
  const level = levelForXp(xp)
  const idx = level - 1
  const base = idx < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[idx] : baseFor(level)
  const next = level < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level] : base + 1500
  const range = Math.max(1, next - base)
  return {
    level,
    current: xp,
    base,
    next,
    progress: Math.min(1, (xp - base) / range),
    remaining: Math.max(0, next - xp),
  }
}

function baseFor(level: number): number {
  return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + (level - LEVEL_THRESHOLDS.length + 1) * 1500
}

export const XP_PER_CLEANUP = 60
export const XP_PER_KG = 4