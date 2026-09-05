import { defineStore } from 'pinia'
import { computed } from 'vue'
import { rankForXp, levelSpan } from '@/data/gamification'
import { ACHIEVEMENTS } from '@/data/achievements'
import { TOP_USERS } from '@/data/misc'
import { useUserStore } from './user'

export const useGamificationStore = defineStore('gamification', () => {
  const user = useUserStore()

  const profile = computed(() => user.profile)

  const rank = computed(() => (profile.value ? rankForXp(profile.value.xp) : null))

  const span = computed(() => (profile.value ? levelSpan(profile.value.xp) : null))

  const level = computed(() => (profile.value ? levelSpan(profile.value.xp).level : 1))

  const achievements = computed(() => {
    const profileValue = profile.value
    return ACHIEVEMENTS.map((a) => {
      let current = 0
      const target = a.target
      if (profileValue) {
        current = {
          cleanups: Math.min(target, profileValue.cleanupsDone),
          points: Math.min(target, profileValue.socialPoints),
          kg: Math.min(target, profileValue.kgWaste),
          joined: Math.min(target, profileValue.joinedEventIds.length),
          map: profileValue.mapViewed ? 1 : 0,
          favorite: Math.min(target, profileValue.favoriteReserveIds.length),
        }[a.condition]
      }
      const unlocked = profileValue?.achievementIds.includes(a.id) ?? false
      return {
        ...a,
        current,
        unlocked,
        progress: Math.min(1, current / target),
      }
    })
  })

  const unlockedCount = computed(() => achievements.value.filter((a) => a.unlocked).length)

  const leaderboard = computed(
    () =>
      TOP_USERS.map((u) => ({
        ...u,
        rankTitle: rankForXp(u.xp).title,
        rankIcon: rankForXp(u.xp).icon,
      })),
  )

  return { rank, span, level, achievements, unlockedCount, leaderboard }
})