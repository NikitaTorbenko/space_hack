export type PollutionLevel = 'severe' | 'medium' | 'low'

export interface Coordinates {
  lat: number
  lng: number
}

export interface PollutionPoint {
  id: string
  level: PollutionLevel
  coords: Coordinates
  region: string
  description: string
  plasticKg: number
  source: string
  lastScan: string
}

export type ReserveKind = 'reserve' | 'nationalPark'

export interface Reserve {
  id: string
  name: string
  region: string
  kind: ReserveKind
  description: string
  coords: Coordinates
  pollution: PollutionLevel
  pollutionIndex: number
  areaKm2: number
  established: number
  tags: string[]
  residents: string[]
  lastScan: string
}

export interface CleanupEvent {
  id: string
  reserveId: string
  reserveName: string
  title: string
  dateISO: string
  dateLabel: string
  dayOffset: number
  time: string
  meetPoint: string
  description: string
  slots: number
  baseJoined: number
  rewardPoints: number
  rewardXp: number
  pollution: PollutionLevel
}

export interface RankDef {
  id: string
  title: string
  icon: string
  minXp: number
}

export type AchievementCondition =
  | 'cleanups'
  | 'points'
  | 'joined'
  | 'kg'
  | 'map'
  | 'favorite'

export interface AchievementDef {
  id: string
  title: string
  description: string
  icon: string
  condition: AchievementCondition
  target: number
  bonusPoints: number
  bonusXp: number
  hint: string
}

export interface LeaderUser {
  name: string
  city: string
  xp: number
  points: number
  level: number
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  city: string
  createdAt: string
  xp: number
  socialPoints: number
  kgWaste: number
  cleanupsDone: number
  joinedEventIds: string[]
  completedEventIds: string[]
  achievementIds: string[]
  favoriteReserveIds: string[]
  mapViewed: boolean
}