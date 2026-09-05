<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseModal from '@/components/ui/BaseModal.vue'
import { getReserve } from '@/data/reserves'
import { eventsForReserve } from '@/data/events'
import { POLLUTION_LEVELS } from '@/data/pollution'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  reserveId: string | null
  open: boolean
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const user = useUserStore()
const router = useRouter()

const reserve = computed(() => (props.reserveId ? getReserve(props.reserveId) : undefined))
const events = computed(() => (props.reserveId ? eventsForReserve(props.reserveId) : []))

const joinedCount = computed(() => {
  if (!props.reserveId) return 0
  return eventsForReserve(props.reserveId).filter((e) => user.isJoined(e.id)).length
})

function goLogin() {
  emit('close')
  router.push({ name: 'login', query: { then: 'home' } })
}
</script>

<template>
  <BaseModal :open="open" :title="reserve?.name ?? ''" wide @close="emit('close')">
    <div v-if="reserve" class="reserve">
      <div class="reserve__top">
        <div class="reserve__badges">
          <span class="chip">{{ reserve.kind === 'reserve' ? '🦌 заповедник' : '🏞️ нацпарк' }}</span>
          <span class="chip">📍 {{ reserve.region }}</span>
          <span
            class="poll-badge"
            :style="{ background: POLLUTION_LEVELS[reserve.pollution].color }"
          >
            {{ POLLUTION_LEVELS[reserve.pollution].label }} загрязнение
          </span>
        </div>
        <button
          class="fav"
          :class="{ 'fav--on': user.isAuthed && user.profile!.favoriteReserveIds.includes(reserve.id) }"
          :title="'Добавить в избранное'"
          @click="user.isAuthed && user.toggleFavorite(reserve.id)"
        >
          <span class="fav__icon" :class="{ 'fav__icon--on': user.isAuthed && user.profile!.favoriteReserveIds.includes(reserve.id) }">♥</span>
          <span>{{ user.isAuthed && user.profile!.favoriteReserveIds.includes(reserve.id) ? 'в избранном' : 'в избранное' }}</span>
        </button>
      </div>

      <p class="reserve__desc">{{ reserve.description }}</p>

      <div class="reserve__facts">
        <div class="fact">
          <span class="fact__num">{{ reserve.areaKm2.toLocaleString('ru-RU') }}</span>
          <span class="fact__label">км² заповедной зоны</span>
        </div>
        <div class="fact">
          <span class="fact__num">{{ reserve.established }}</span>
          <span class="fact__label">год основания</span>
        </div>
        <div class="fact">
          <span class="fact__num">{{ reserve.pollutionIndex }}</span>
          <span class="fact__label">индекс загрязнения</span>
        </div>
        <div class="fact">
          <span class="fact__num">{{ POLLUTION_LEVELS[reserve.pollution].short }}</span>
          <span class="fact__label">по данным ДЗЗ</span>
        </div>
      </div>

      <div class="reserve__tags">
        <span class="tag" v-for="t in reserve.tags" :key="t">{{ t }}</span>
      </div>

      <div class="reserve__scan">
        🛰️ Последний спутниковый скан: <b>{{ reserve.lastScan }}</b> · обитатели: {{ reserve.residents.join(', ') }}
      </div>

      <div class="reserve__events-head">
        <h4 class="reserve__events-title">Уборки в этом заповеднике</h4>
        <span v-if="user.isAuthed && joinedCount" class="chip chip--active">ты записан{{ joinedCount }}</span>
      </div>

      <div class="events">
        <div v-for="ev in events" :key="ev.id" class="event">
          <div class="event__main">
            <div class="event__title-row">
              <span class="event__title">{{ ev.title }}</span>
              <span class="event__day">{{ ev.dayOffset }} дн.</span>
            </div>
            <div class="event__meta">
              <span>📅 {{ ev.dateLabel }}</span>
              <span>🕙 {{ ev.time }}</span>
              <span>🚩 {{ ev.meetPoint }}</span>
            </div>
            <p class="event__desc">{{ ev.description }}</p>
          </div>

          <div class="event__side">
            <div class="event__rewards">
              <span class="reward reward--pts">+{{ ev.rewardPoints }} баллов</span>
              <span class="reward reward--xp">+{{ ev.rewardXp }} опыта</span>
            </div>
            <div class="event__slots">
              Свободно мест: <b>{{ Math.max(0, ev.slots - ev.baseJoined - (user.isJoined(ev.id) ? 1 : 0)) }}</b>
              <span class="slots-bar">
                <span
                  class="slots-bar__fill"
                  :style="{ width: Math.min(100, ((ev.baseJoined + (user.isJoined(ev.id) ? 1 : 0)) / ev.slots) * 100) + '%' }"
                ></span>
              </span>
            </div>

            <template v-if="user.isAuthed">
              <button v-if="!user.isJoined(ev.id)" class="btn btn--primary btn--sm" @click="user.joinEvent(ev.id)">
                Записаться
              </button>
              <button v-else class="btn btn--ghost btn--sm" @click="user.leaveEvent(ev.id)">
                ✓ Ты записан — отменить
              </button>
            </template>
            <button v-else class="btn btn--ghost btn--sm" @click="goLogin">Войти и записаться</button>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
.reserve {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.reserve__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;

  .reserve__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.poll-badge {
  color: #0a1420;
  font-weight: 800;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 999px;
}

.fav {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  background: rgba(255, 91, 95, 0.06);
  color: var(--text-dim);
  font-size: 13px;
  font-weight: 700;
  transition: all 0.2s;

  &__icon {
    color: var(--text-faint);
    font-size: 15px;

    &--on {
      color: #ff5b5f;
      filter: drop-shadow(0 0 8px rgba(255, 91, 95, 0.7));
    }
  }

  &--on {
    border-color: rgba(255, 91, 95, 0.45);
    background: rgba(255, 91, 95, 0.12);
    color: var(--white);
  }
}

.reserve__desc {
  color: var(--text-dim);
  font-size: 14.5px;
}

.reserve__facts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.fact {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: rgba(139, 224, 214, 0.05);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px 14px;

  &__num {
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 700;
    color: var(--mint);
  }
  &__label {
    font-size: 11px;
    color: var(--text-faint);
  }
}

.reserve__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 6px 13px;
  border-radius: 999px;
  background: rgba(76, 201, 255, 0.1);
  border: 1px solid rgba(76, 201, 255, 0.28);
  color: var(--cyan);
  font-size: 12.5px;
  font-weight: 600;
}

.reserve__scan {
  font-size: 12.5px;
  color: var(--text-faint);
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(139, 224, 214, 0.04);
  border: 1px dashed var(--line-strong);
  b {
    color: var(--text-dim);
  }
}

.reserve__events-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.reserve__events-title {
  font-size: 15px;
  color: var(--white);
}

.events {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.event {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  background: rgba(9, 24, 39, 0.7);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 16px;

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  &__title {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    color: var(--white);
  }

  &__day {
    font-size: 11px;
    font-weight: 700;
    color: var(--gold);
    background: rgba(255, 196, 77, 0.12);
    border: 1px solid rgba(255, 196, 77, 0.35);
    border-radius: 999px;
    padding: 3px 10px;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 16px;
    font-size: 12.5px;
    color: var(--text-dim);
    margin-bottom: 8px;
  }

  &__desc {
    font-size: 12.5px;
    color: var(--text-faint);
  }

  &__side {
    flex: none;
    width: 210px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  &__rewards {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__slots {
    font-size: 11.5px;
    color: var(--text-faint);

    b {
      color: var(--text-dim);
    }
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

.slots-bar {
  display: block;
  height: 6px;
  border-radius: 4px;
  background: rgba(139, 224, 214, 0.1);
  margin-top: 6px;
  overflow: hidden;

  &__fill {
    display: block;
    height: 100%;
    border-radius: 4px;
    background: var(--grad-primary);
    transition: width 0.4s ease;
  }
}

@media (max-width: 640px) {
  .reserve__facts {
    grid-template-columns: repeat(2, 1fr);
  }
  .event {
    flex-direction: column;
    &__side {
      width: 100%;
    }
  }
}
</style>