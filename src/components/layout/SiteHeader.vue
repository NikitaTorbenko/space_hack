<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useGamificationStore } from '@/stores/gamification'

const user = useUserStore()
const game = useGamificationStore()
const router = useRouter()

const menuOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Карта берегов' },
  { to: '/about', label: 'О проекте' },
]

function goCabinet() {
  menuOpen.value = false
  if (!user.isAuthed) {
    router.push({ name: 'login', query: { then: 'cabinet' } })
  } else {
    router.push({ name: 'cabinet' })
  }
}
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <RouterLink to="/" class="brand" @click="menuOpen = false">
        <span class="brand__mark" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none">
            <path
              d="M20 5C11.7 5 5 11.7 5 20s6.7 15 15 15 15-6.7 15-15S28.3 5 20 5Z"
              fill="url(#g1)"
              opacity="0.35"
            />
            <path
              d="M8 23c4-3 7-.5 11-4 3-2.6 6-2.3 9 1"
              stroke="url(#g1)"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              d="M11 29c5-4 9-5 14-9 2.6-2 5-5 6-7"
              stroke="#5ef0c6"
              stroke-width="3"
              stroke-linecap="round"
            />
            <defs>
              <linearGradient id="g1" x1="5" y1="5" x2="35" y2="35">
                <stop stop-color="#2dd4bf" />
                <stop offset="1" stop-color="#4cc9ff" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span class="brand__text">
          <span class="brand__name">Чистый берег</span>
          <span class="brand__sub">спутниковый мониторинг · твоя планета</span>
        </span>
      </RouterLink>

      <nav class="nav" :class="{ 'nav--open': menuOpen }" aria-label="Основная навигация">
        <RouterLink
          v-for="l in navLinks"
          :key="l.to"
          :to="l.to"
          class="nav__link"
          @click="menuOpen = false"
        >
          {{ l.label }}
        </RouterLink>
        <button class="nav__link nav__link--btn" @click="goCabinet">
          {{ user.isAuthed ? 'Личный кабинет' : 'Войти' }}
        </button>
      </nav>

      <div class="header__actions">
        <button v-if="user.isAuthed" class="user-pill" @click="goCabinet">
          <span class="user-pill__avatar">{{ user.profile!.avatar }}</span>
          <span class="user-pill__meta">
            <span class="user-pill__name">{{ user.profile!.name }}</span>
            <span class="user-pill__stats">
              Lv {{ game.level }} · {{ user.profile!.socialPoints }} баллов
            </span>
          </span>
        </button>
        <button v-else class="btn btn--primary btn--sm" @click="goCabinet">Войти</button>
        <button class="burger" aria-label="Меню" :class="{ 'burger--on': menuOpen }" @click="menuOpen = !menuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 90;
  background: rgba(6, 17, 29, 0.72);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--line);
}

.header__inner {
  height: var(--header-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;

  &__mark {
    width: 42px;
    height: 42px;
    flex: none;
    filter: drop-shadow(0 4px 16px rgba(45, 212, 191, 0.4));
  }

  &__text {
    display: flex;
    flex-direction: column;
  }

  &__name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 16px;
    color: var(--white);
    letter-spacing: 0.01em;
  }

  &__sub {
    font-size: 11px;
    color: var(--text-faint);
    letter-spacing: 0.03em;
  }
}

.nav {
  display: flex;
  align-items: center;
  gap: 6px;

  &__link {
    padding: 9px 16px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 14.5px;
    color: var(--text-dim);
    border: 1px solid transparent;
    background: transparent;
    transition: all 0.2s;

    &:hover {
      color: var(--white);
      background: rgba(139, 224, 214, 0.07);
    }

    &.router-link-active {
      color: var(--mint);
      background: rgba(139, 224, 214, 0.09);
      border-color: var(--line);
    }

    &--btn {
      padding: 11px 20px;
      border-radius: 999px;
      color: #041019;
      background: var(--grad-primary);
      box-shadow: var(--glow-teal);
      &:hover {
        filter: brightness(1.08);
      }
    }
  }
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 16px 6px 7px;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  background: rgba(139, 224, 214, 0.07);
  transition: all 0.2s;
  &:hover {
    background: rgba(139, 224, 214, 0.13);
    transform: translateY(-1px);
  }

  &__avatar {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--grad-primary-soft);
    font-size: 19px;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
  }

  &__name {
    font-weight: 700;
    font-size: 13.5px;
    color: var(--white);
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__stats {
    font-size: 11.5px;
    color: var(--text-faint);
  }
}

.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid var(--line-strong);
  background: rgba(139, 224, 214, 0.06);

  span {
    width: 20px;
    height: 2px;
    border-radius: 2px;
    background: var(--text-dim);
    transition: all 0.25s;
  }

  &--on span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  &--on span:nth-child(2) {
    opacity: 0;
  }
  &--on span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
}

@media (max-width: 900px) {
  .nav {
    position: absolute;
    top: var(--header-h);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 16px 20px 22px;
    background: rgba(7, 19, 32, 0.96);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--line);
    display: none;

    &--open {
      display: flex;
    }
  }

  .nav__link {
    padding: 14px 16px;
    text-align: center;
  }

  .burger {
    display: flex;
  }

  .header__actions .user-pill {
    display: none;
  }
}
</style>