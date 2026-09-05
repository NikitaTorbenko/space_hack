<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useGamificationStore } from '@/stores/gamification'
import { getEvent, eventKgByLevel } from '@/data/events'
import { getReserve } from '@/data/reserves'
import { ACHIEVEMENTS } from '@/data/achievements'

const user = useUserStore()
const game = useGamificationStore()
const tab = ref<'planned' | 'history' | 'achievements' | 'leaderboard'>('planned')

const profile = computed(() => user.profile!)

const plannedEvents = computed(() =>
  profile.value.joinedEventIds.map(getEvent).filter(Boolean),
)

const historyEvents = computed(() =>
  profile.value.completedEventIds.map(getEvent).filter(Boolean),
)

const reserveNames = computed(() => {
  const map: Record<string, string> = {}
  profile.value.favoriteReserveIds.forEach((id) => {
    map[id] = getReserve(id)?.name ?? id
  })
  return map
})

function reserveName(id: string) {
  return getReserve(id)?.name ?? id
}

function complete(eventId: string) {
  user.completeEvent(eventId)
}

function leave(id: string) {
  user.leaveEvent(id)
}
</script>

<template>
  <main class="cabinet" v-if="profile">
    <div class="container cabinet__grid">
      <!-- LEFT SIDEBAR -->
      <div class="sidebar">
        <div class="profile card" v-reveal>
          <div class="profile__top">
            <div class="profile__avatar">{{ profile.avatar }}</div>
            <div>
              <h2 class="profile__name">{{ profile.name }}</h2>
              <div class="profile__sub">{{ profile.city }} · {{ profile.email }}</div>
            </div>
          </div>

          <div class="profile__rank" v-if="game.rank">
            <span class="profile__rank-icon">{{ game.rank.icon }}</span>
            <span class="profile__rank-title">{{ game.rank.title }}</span>
          </div>

          <div class="xp" v-if="game.span">
            <div class="xp__bar">
              <div class="xp__fill" :style="{ width: game.span.progress * 100 + '%' }"></div>
            </div>
            <div class="xp__labels">
              <span>Lv {{ game.level }}</span>
              <span>{{ game.span.remaining }} XP до след.</span>
            </div>
          </div>

          <div class="profile__stats">
            <div class="stat">
              <span class="stat__num gradient-text gradient-text--gold">{{ profile.socialPoints }}</span>
              <span class="stat__label">баллов</span>
            </div>
            <div class="stat">
              <span class="stat__num gradient-text">{{ profile.xp }}</span>
              <span class="stat__label">опыта</span>
            </div>
            <div class="stat">
              <span class="stat__num">{{ profile.cleanupsDone }}</span>
              <span class="stat__label">уборок</span>
            </div>
            <div class="stat">
              <span class="stat__num">{{ profile.kgWaste }} кг</span>
              <span class="stat__label">мусора</span>
            </div>
          </div>

          <div class="fav-reserves" v-if="Object.keys(reserveNames).length">
            <div class="fav-reserves__title">❤️ Избранные заповедники</div>
            <div class="fav-reserves__list">
              <RouterLink
                v-for="(name, id) in reserveNames"
                :key="id"
                to="/"
                class="fav-reserve"
              >
                🌿 {{ name }}
              </RouterLink>
            </div>
          </div>

          <button class="btn btn--ghost btn--sm" @click="user.logout()">Выйти из профиля</button>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="main-col">
        <div class="tabs" v-reveal>
          <button class="tab" :class="{ 'tab--active': tab === 'planned' }" @click="tab = 'planned'">
            📅 Мои записи
            <span v-if="plannedEvents.length" class="tab__count">{{ plannedEvents.length }}</span>
          </button>
          <button class="tab" :class="{ 'tab--active': tab === 'history' }" @click="tab = 'history'">
            📜 История
            <span v-if="historyEvents.length" class="tab__count">{{ historyEvents.length }}</span>
          </button>
          <button class="tab" :class="{ 'tab--active': tab === 'achievements' }" @click="tab = 'achievements'">
            🏅 Достижения
            <span class="tab__count">{{ game.unlockedCount }}/{{ ACHIEVEMENTS.length }}</span>
          </button>
          <button class="tab" :class="{ 'tab--active': tab === 'leaderboard' }" @click="tab = 'leaderboard'">
            🏆 Таблица лидеров
          </button>
        </div>

        <!-- PLANNED -->
        <div v-if="tab === 'planned' && !plannedEvents.length" class="empty card" v-reveal>
          <p>Пока нет записей. Зайди на главную и выбери заповедник!</p>
          <RouterLink class="btn btn--primary" to="/">Открыть карту</RouterLink>
        </div>
        <div v-else-if="tab === 'planned'" class="event-list">
          <div v-for="ev in plannedEvents" :key="ev!.id" class="ev card" v-reveal>
            <div class="ev__main">
              <div class="ev__head">
                <span class="ev__title">{{ ev!.title }}</span>
                <span class="ev__day">через {{ ev!.dayOffset }} дн.</span>
              </div>
              <div class="ev__meta">
                <span>🛡️ {{ reserveName(ev!.reserveId) }}</span>
                <span>📅 {{ ev!.dateLabel }}</span>
                <span>🕙 {{ ev!.time }}</span>
              </div>
              <p class="ev__meet">🚩 {{ ev!.meetPoint }}</p>
            </div>
            <div class="ev__actions">
              <button class="btn btn--gold btn--sm" @click="complete(ev!.id)">
                ✅ Организатор подтвердил — получить баллы
              </button>
              <button class="btn btn--ghost btn--sm" @click="leave(ev!.id)">Отменить запись</button>
            </div>
          </div>
        </div>

        <!-- HISTORY -->
        <div v-if="tab === 'history' && !historyEvents.length" class="empty card" v-reveal>
          <p>История пуста. Выполни первую уборку — и она появится здесь!</p>
        </div>
        <div v-else-if="tab === 'history'" class="event-list">
          <div v-for="ev in historyEvents" :key="ev!.id" class="ev ev--done card" v-reveal>
            <div class="ev__main">
              <div class="ev__head">
                <span class="ev__title">{{ ev!.title }}</span>
                <span class="ev__badge-done">✅ выполнено</span>
              </div>
              <div class="ev__meta">
                <span>🛡️ {{ reserveName(ev!.reserveId) }}</span>
                <span>📅 {{ ev!.dateLabel }}</span>
              </div>
              <div class="ev__rewards">
                <span class="reward reward--pts">+{{ ev!.rewardPoints }} баллов</span>
                <span class="reward reward--xp">+{{ ev!.rewardXp }} опыта</span>
                <span class="reward reward--kg">~{{ eventKgByLevel(ev!.pollution) }} кг мусора</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ACHIEVEMENTS -->
        <div v-if="tab === 'achievements'" class="ach-grid">
          <div
            v-for="a in game.achievements"
            :key="a.id"
            class="ach card"
            :class="{ 'ach--unlocked': a.unlocked }"
            v-reveal
          >
            <span class="ach__icon">{{ a.icon }}</span>
            <h4 class="ach__title">{{ a.title }}</h4>
            <p class="ach__desc">{{ a.description }}</p>
            <div class="ach__progress" v-if="!a.unlocked">
              <div class="ach__bar">
                <div class="ach__bar-fill" :style="{ width: a.progress * 100 + '%' }"></div>
              </div>
              <span class="ach__hint">{{ a.hint }}</span>
            </div>
            <span v-else class="ach__ok">✅ Разблокировано</span>
          </div>
        </div>

        <!-- LEADERBOARD -->
        <div v-if="tab === 'leaderboard'" class="leaderboard">
          <div class="leader-header card" v-reveal>
            <div class="leader-row leader-row--you">
              <span class="leader-row__pos">—</span>
              <span class="leader-row__icon">{{ profile.avatar }}</span>
              <span class="leader-row__name">{{ profile.name }}</span>
              <span class="leader-row__xp">{{ profile.xp }} XP</span>
              <span class="leader-row__badge">ты</span>
            </div>
          </div>
          <div class="leader-list">
            <div
              v-for="(u, i) in game.leaderboard"
              :key="i"
              class="leader-row card"
              v-reveal
            >
              <span class="leader-row__pos">{{ i + 1 }}</span>
              <span class="leader-row__icon">{{ u.rankIcon }}</span>
              <div class="leader-row__info">
                <span class="leader-row__name">{{ u.name }}</span>
                <span class="leader-row__sub">{{ u.city }} · {{ u.rankTitle }}</span>
              </div>
              <span class="leader-row__xp">{{ u.xp }} XP</span>
              <span class="leader-row__points">{{ u.points }} баллов</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.cabinet {
  padding-top: 40px;
  padding-bottom: 80px;

  &__grid {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 28px;
    align-items: start;
  }
}

.sidebar {
  position: sticky;
  top: calc(var(--header-h) + 28px);
}

.profile {
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__top {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  &__avatar {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 32px;
    background: var(--grad-primary-soft);
    border: 1px solid var(--line-strong);
    flex: none;
  }

  &__name {
    font-size: 20px;
    margin: 0;
  }

  &__sub {
    font-size: 12.5px;
    color: var(--text-faint);
  }

  &__rank {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 14px;
    background: rgba(255, 196, 77, 0.1);
    border: 1px solid rgba(255, 196, 77, 0.28);
  }

  &__rank-icon {
    font-size: 22px;
  }

  &__rank-title {
    font-weight: 700;
    color: var(--gold);
    font-size: 14px;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(139, 224, 214, 0.05);
  border: 1px solid var(--line);

  &__num {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
  }

  &__label {
    font-size: 11px;
    color: var(--text-faint);
  }
}

.xp {
  &__bar {
    height: 10px;
    border-radius: 6px;
    background: rgba(139, 224, 214, 0.09);
    border: 1px solid var(--line);
    overflow: hidden;
  }
  &__fill {
    height: 100%;
    border-radius: 6px;
    background: var(--grad-primary);
    transition: width 0.6s ease;
  }
  &__labels {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    font-size: 12px;
    color: var(--text-faint);
  }
}

.fav-reserves {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__title {
    font-size: 12.5px;
    color: var(--text-dim);
    font-weight: 700;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
}

.fav-reserve {
  padding: 7px 13px;
  border-radius: 999px;
  background: rgba(45, 212, 191, 0.1);
  border: 1px solid rgba(45, 212, 191, 0.3);
  color: var(--mint);
  font-size: 12.5px;
  font-weight: 600;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 11px 18px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(139, 224, 214, 0.05);
  color: var(--text-dim);
  font-weight: 700;
  font-size: 13.5px;
  transition: all 0.2s;

  &--active {
    background: var(--grad-primary-soft);
    border-color: var(--line-strong);
    color: var(--white);
  }

  &__count {
    background: rgba(139, 224, 214, 0.15);
    padding: 2px 9px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: var(--mint);
  }
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ev {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  gap: 18px;

  &--done {
    background: rgba(9, 24, 39, 0.7);
  }

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__title {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 600;
    color: var(--white);
  }

  &__day {
    font-size: 12px;
    font-weight: 700;
    color: var(--gold);
    background: rgba(255, 196, 77, 0.12);
    border: 1px solid rgba(255, 196, 77, 0.3);
    padding: 3px 10px;
    border-radius: 999px;
  }

  &__badge-done {
    font-size: 11.5px;
    color: var(--green);
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(91, 227, 138, 0.1);
    border: 1px solid rgba(91, 227, 138, 0.3);
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    font-size: 12.5px;
    color: var(--text-dim);
  }

  &__meet {
    font-size: 12.5px;
    color: var(--text-faint);
  }

  &__rewards {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__actions {
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
    justify-content: center;
  }
}

.reward {
  font-size: 11.5px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
}
.reward--pts {
  color: #ffc44d;
  background: rgba(255, 196, 77, 0.12);
  border: 1px solid rgba(255, 196, 77, 0.3);
}
.reward--xp {
  color: var(--mint);
  background: rgba(45, 212, 191, 0.12);
  border: 1px solid rgba(45, 212, 191, 0.3);
}
.reward--kg {
  color: var(--cyan);
  background: rgba(76, 201, 255, 0.12);
  border: 1px solid rgba(76, 201, 255, 0.3);
}

.empty {
  padding: 36px;
  text-align: center;
  color: var(--text-dim);
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
}

.ach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.ach {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0.55;
  filter: grayscale(0.7);
  transition: all 0.3s ease;

  &--unlocked {
    opacity: 1;
    filter: none;
    border-color: rgba(255, 196, 77, 0.4);
    background: linear-gradient(160deg, rgba(255, 196, 77, 0.08), rgba(9, 24, 39, 0.9));
  }

  &__icon {
    font-size: 30px;
  }
  &__title {
    font-size: 15px;
    color: var(--white);
  }
  &__desc {
    font-size: 12.5px;
    color: var(--text-dim);
  }
  &__progress {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  &__bar {
    height: 7px;
    border-radius: 6px;
    background: rgba(139, 224, 214, 0.1);
    overflow: hidden;
  }
  &__bar-fill {
    height: 100%;
    border-radius: 6px;
    background: var(--grad-primary);
  }
  &__hint {
    font-size: 11px;
    color: var(--text-faint);
  }
  &__ok {
    font-size: 12px;
    color: var(--gold);
    font-weight: 700;
  }
}

.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.leader-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.leader-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;

  &--you {
    border-color: rgba(45, 212, 191, 0.45);
    background: linear-gradient(140deg, rgba(45, 212, 191, 0.09), rgba(9, 24, 39, 0.9));
  }

  &__pos {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 800;
    width: 28px;
    text-align: center;
    color: var(--text-faint);
  }

  &__icon {
    font-size: 22px;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__name {
    font-weight: 700;
    font-size: 14px;
    color: var(--white);
  }

  &__sub {
    font-size: 12px;
    color: var(--text-faint);
  }

  &__xp {
    font-family: var(--font-display);
    font-size: 13px;
    color: var(--mint);
  }

  &__points {
    font-size: 12px;
    color: var(--gold);
    background: rgba(255, 196, 77, 0.12);
    border: 1px solid rgba(255, 196, 77, 0.28);
    padding: 4px 10px;
    border-radius: 999px;
  }

  &__badge {
    font-size: 10.5px;
    color: var(--teal);
    padding: 3px 9px;
    border-radius: 999px;
    background: rgba(45, 212, 191, 0.1);
    border: 1px solid rgba(45, 212, 191, 0.3);
  }
}

@media (max-width: 880px) {
  .cabinet__grid {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: static;
  }
}
</style>