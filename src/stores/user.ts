import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { UserProfile } from '@/data/types'
import { ACHIEVEMENTS } from '@/data/achievements'
import { EVENTS, getEvent, eventKgByLevel } from '@/data/events'
import { loadJSON, saveJSON } from '@/utils/storage'
import { useUiStore } from './ui'

const ACTIVE_SET: Record<string, typeof ACHIEVEMENTS> = {
  cleanups: ACHIEVEMENTS.filter((a) => a.condition === 'cleanups'),
  points: ACHIEVEMENTS.filter((a) => a.condition === 'points'),
  kg: ACHIEVEMENTS.filter((a) => a.condition === 'kg'),
  map: ACHIEVEMENTS.filter((a) => a.condition === 'map'),
  favorite: ACHIEVEMENTS.filter((a) => a.condition === 'favorite'),
  joined: ACHIEVEMENTS.filter((a) => a.condition === 'joined'),
}

const STORAGE_KEY = 'user:v1'

let uid = 1
function nextId(prefix: string): string {
  return `${prefix}-${uid++}-${Date.now().toString(36)}`
}

function freshProfile(name: string, email: string, city: string): UserProfile {
  return {
    id: nextId('u'),
    name,
    email,
    avatar: '🐋',
    city,
    createdAt: new Date().toISOString(),
    xp: 0,
    socialPoints: 0,
    kgWaste: 0,
    cleanupsDone: 0,
    joinedEventIds: [],
    completedEventIds: [],
    achievementIds: [],
    favoriteReserveIds: [],
    mapViewed: false,
  }
}

export function demoProfile(): UserProfile {
  const seed = EVENTS.filter((e) => e.dayOffset < 0).slice(-4)
  const completedIds = seed.length >= 4 ? seed.map((e) => e.id) : ['ev-3', 'ev-5', 'ev-14']
  let xp = 610
  let points = 300
  let kg = 96
  const completed = completedIds
    .map((id) => getEvent(id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
  completed.forEach((e) => {
    xp += e.rewardXp
    points += e.rewardPoints
    kg += eventKgByLevel(e.pollution)
  })
  return {
    id: nextId('u-demo'),
    name: 'Демо-участник',
    email: 'demo@chistiy-bereg.ru',
    avatar: '🦭',
    city: 'Санкт-Петербург',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 130).toISOString(),
    xp,
    socialPoints: points,
    kgWaste: Math.round(kg),
    cleanupsDone: completed.length,
    joinedEventIds: [],
    completedEventIds: completedIds,
    achievementIds: ['first-cleanup', 'joined-3', 'points-100', 'map-explorer', 'favorite-1'],
    favoriteReserveIds: ['res-baikal', 'res-fem'],
    mapViewed: true,
  }
}

export const useUserStore = defineStore('user', () => {
  const ui = useUiStore()
  const profile = ref<UserProfile | null>(loadJSON<UserProfile>(STORAGE_KEY))

  watch(
    profile,
    (value) => saveJSON(STORAGE_KEY, value),
    { deep: true },
  )

  const isAuthed = computed(() => profile.value !== null)

  function login(name: string, email: string, city: string): void {
    profile.value = freshProfile(name.trim() || 'Хранитель берега', email.trim(), city.trim() || 'Новый город')
    ui.toast(`Добро пожаловать, ${profile.value.name}! Прокачай свой первый уровень 🌱`, 'success')
  }

  function loginDemo(): void {
    profile.value = demoProfile()
    ui.toast('Демо-профиль загружен: опыт, звание и достижения уже на месте 🎯', 'gold')
  }

  function logout(): void {
    profile.value = null
    ui.toast('Вы вышли из профиля. До встречи на берегу!', 'info')
  }

  function joinEvent(eventId: string): boolean {
    const current = profile.value
    if (!current) return false
    const event = getEvent(eventId)
    if (!event) return false
    if (current.joinedEventIds.includes(eventId)) return false
    current.joinedEventIds.push(eventId)
    ui.toast(`Ты в деле! Запись на «${event.title}» подтверждена 🎉`, 'success')
    unlockCheck('joined')
    return true
  }

  function leaveEvent(eventId: string): void {
    const current = profile.value
    if (!current) return
    current.joinedEventIds = current.joinedEventIds.filter((id) => id !== eventId)
    ui.toast('Запись отменена', 'info')
  }

  function completeEvent(eventId: string): void {
    const current = profile.value
    if (!current) return
    if (!current.joinedEventIds.includes(eventId)) return
    const event = getEvent(eventId)
    if (!event) return
    current.joinedEventIds = current.joinedEventIds.filter((id) => id !== eventId)
    current.completedEventIds.push(eventId)
    current.cleanupsDone += 1
    current.xp += event.rewardXp
    current.socialPoints += event.rewardPoints
    current.kgWaste += eventKgByLevel(event.pollution)
    ui.toast(
      `Организатор подтвердил участие! +${event.rewardPoints} баллов, +${event.rewardXp} опыта 🏅`,
      'gold',
    )
    unlockCheck('cleanups')
    unlockCheck('points')
    unlockCheck('kg')
  }

  function markMapViewed(): void {
    const current = profile.value
    if (!current || current.mapViewed) return
    current.mapViewed = true
    unlockCheck('map')
  }

  function toggleFavorite(reserveId: string): void {
    const current = profile.value
    if (!current) return
    const has = current.favoriteReserveIds.includes(reserveId)
    if (has) {
      current.favoriteReserveIds = current.favoriteReserveIds.filter((id) => id !== reserveId)
    } else {
      current.favoriteReserveIds.push(reserveId)
      unlockCheck('favorite')
    }
  }

  function isJoined(eventId: string): boolean {
    return profile.value?.joinedEventIds.includes(eventId) ?? false
  }

  function isCompleted(eventId: string): boolean {
    return profile.value?.completedEventIds.includes(eventId) ?? false
  }

  function unlockCheck(condition: 'cleanups' | 'points' | 'kg' | 'map' | 'favorite' | 'joined'): void {
    const current = profile.value
    if (!current) return
    const value: number = {
      cleanups: current.cleanupsDone,
      points: current.socialPoints,
      kg: current.kgWaste,
      map: current.mapViewed ? 1 : 0,
      favorite: current.favoriteReserveIds.length,
      joined: current.joinedEventIds.length,
    }[condition]

    const newly = (ACTIVE_SET[condition] ?? []).filter((a) => {
      if (current.achievementIds.includes(a.id)) return false
      return value >= a.target
    })
    newly.forEach((a) => {
      current.achievementIds.push(a.id)
      current.xp += a.bonusXp
      current.socialPoints += a.bonusPoints
      ui.toast(`Достижение получено: «${a.title}» ${a.icon} +${a.bonusPoints} баллов`, 'gold')
    })
    if (newly.length) unlockCheck('cleanups')
  }

  return {
    profile,
    isAuthed,
    login,
    loginDemo,
    logout,
    joinEvent,
    leaveEvent,
    completeEvent,
    markMapViewed,
    toggleFavorite,
    isJoined,
    isCompleted,
  }
})