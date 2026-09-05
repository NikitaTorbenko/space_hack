<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import RussiaMap from "@/components/map/RussiaMap.vue";
import ReserveModal from "@/components/map/ReserveModal.vue";
import { PEOPLE_COMMENTS } from "@/data/misc";
import { RANKS } from "@/data/gamification";

const user = useUserStore();
const selectedReserve = ref<string | null>(null);
const modalOpen = ref(false);

function openReserve(id: string) {
  selectedReserve.value = id;
  modalOpen.value = true;
}

const steps = [
  {
    icon: "🛰️",
    title: "Смотри с орбиты",
    text: "Спутниковые снимки ДЗЗ находят очаги загрязнения и оценивают их. Осталось выбрать свой заповедник на карте.",
  },
  {
    icon: "📝",
    title: "Записывайся",
    text: "Выбери уборку рядом, дату и займи место. Мест ограничено — на берегу важно не навредить природе.",
  },
  {
    icon: "🧤",
    title: "Убирайся вместе",
    text: "Приезжай к точке встречи. Организатор — сотрудник ООПТ — выдаёт инвентарь и подтверждает участие.",
  },
  {
    icon: "🏅",
    title: "Качай уровень",
    text: "Подтверждённая уборка приносит баллы, опыт и кг чистоты. Расти от «Следопыта» до «Легенды берега».",
  },
];

const heroStats = [
  { value: "12 480", label: "участников движения" },
  { value: "84 т", label: "отходов собрано" },
  { value: "145", label: "заповедных берегов в мониторинге" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

onMounted(() => {
  user.markMapViewed();
});
</script>

<template>
  <main>
    <!-- ======= HERO ======= -->
    <section class="hero">
      <div class="hero__orb hero__orb--1"></div>
      <div class="hero__orb hero__orb--2"></div>
      <div class="container">
        <div class="hero__grid">
          <div class="hero__content">
            <span class="hero__eyebrow"
              >🌍 Экология + космические технологии</span
            >
            <h1 class="hero__title">
              Чистый берег
              <br />
              <span class="gradient-text">начинается с карты</span>
            </h1>
            <p class="hero__text">
              Мы соединили данные спутников, заповедники и волонтёров. Найди
              загрязнённый берег на карте, запишись на уборку и получи опыт,
              баллы и звание — как в игре, только берег реальный.
            </p>
            <div class="hero__actions">
              <button class="btn btn--primary btn--lg" @click="scrollTo('map')">
                🚀 Найти уборку
              </button>
              <button class="btn btn--ghost btn--lg" @click="scrollTo('how')">
                Как это работает
              </button>
            </div>

            <div class="hero__stats">
              <div v-for="(s, i) in heroStats" :key="i" class="hero__stat">
                <b class="gradient-text">{{ s.value }}</b>
                <span>{{ s.label }}</span>
              </div>
            </div>
          </div>

          <div class="hero__visual">
            <div class="globe" aria-hidden="true">
              <div class="globe__ring globe__ring--1"></div>
              <div class="globe__ring globe__ring--2"></div>
              <div class="globe__core">
                <span class="globe__core-icon">🌊</span>
              </div>
              <div class="globe__sat satellite">
                <span>🛰️</span>
              </div>
              <div class="globe__glow"></div>
            </div>

            <div class="float-card float-card--points">
              <span class="float-card__icon">🪙</span>
              <div>
                <b>+60 баллов</b>
                <span>за уборку Утриша</span>
              </div>
            </div>
            <div class="float-card float-card--level">
              <span class="float-card__icon">🏅</span>
              <div>
                <b>Уровень 4</b>
                <span>Хранитель дюн</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= MAP ======= -->
    <section id="map" class="section map-section">
      <div class="map-frame" v-reveal>
        <RussiaMap @select-reserve="openReserve" />
      </div>

      <div class="container">
        <div class="section-head map-caption" v-reveal>
          <span class="eyebrow">Интерактивная карта</span>
          <h2 class="section-head__title">
            Загрязнения по данным ДЗЗ
            <span class="gradient-text">и точки уборок</span>
          </h2>
          <p class="section-head__text">
            Спутники Sentinel-2 и Landsat-9 фиксируют скопления отходов у
            побережий. Цвет региона показывает нагрузку, цветные точки — очаги,
            зелёные «пины» — заповедники, где ждут волонтёров. Нажми на пин и
            запишись на уборку.
          </p>
        </div>

        <div class="map-hint">
          <span
            >🛰️ Данные: Sentinel-2 · Landsat-9 · анализ СР Дата на платформе
            Яндекс.Облако</span
          >
          <span>🧭 Пины-заповедники кликабельны</span>
        </div>
      </div>
    </section>

    <!-- ======= HOW IT WORKS ======= -->
    <section id="how" class="section how-section">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="eyebrow">Как это работает</span>
          <h2 class="section-head__title">
            От экрана к настоящему берегу
            <span class="gradient-text">за 4 шага</span>
          </h2>
        </div>

        <div class="steps">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="step card"
            v-reveal
            :style="{ transitionDelay: i * 90 + 'ms' }"
          >
            <span class="step__num">0{{ i + 1 }}</span>
            <span class="step__icon">{{ step.icon }}</span>
            <h3 class="step__title">{{ step.title }}</h3>
            <p class="step__text">{{ step.text }}</p>
            <svg
              class="step__arrow"
              v-if="i < steps.length - 1"
              viewBox="0 0 40 20"
              aria-hidden="true"
            >
              <path
                d="M0 10h34M28 3l8 7-8 7"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= GAMIFICATION ======= -->
    <section class="section game-section">
      <div class="container">
        <div class="game-layout">
          <div class="game-copy" v-reveal>
            <span class="eyebrow">Геймификация</span>
            <h2 class="section-head__title">
              Помогая планете,
              <span class="gradient-text gradient-text--gold"
                >качаешь себя</span
              >
            </h2>
            <p class="section-head__text">
              Каждая уборка приносит опыт и социальные баллы. Баллы открывают
              достижения, опыт — новые звания и уровни. Чем тяжелее загрязнение
              — тем выше награда.
            </p>
            <div class="game-perks">
              <div class="perk">
                <span>🪙</span><b>Социальные баллы</b
                ><small>за каждую уборку</small>
              </div>
              <div class="perk">
                <span>⚡</span><b>Опыт и уровни</b
                ><small>растёшь от рейдов к рейдам</small>
              </div>
              <div class="perk">
                <span>🏅</span><b>Достижения</b
                ><small>отслеживаются в кабинете</small>
              </div>
            </div>
            <RouterLink class="btn btn--gold" to="/cabinet"
              >Открыть кабинет</RouterLink
            >
          </div>

          <div
            class="ranks card"
            v-reveal
            :style="{ transitionDelay: '120ms' }"
          >
            <div class="ranks__head">
              <h3>Служебная лестница</h3>
              <span>нужно XP</span>
            </div>
            <div class="ranks__list">
              <div v-for="r in RANKS" :key="r.id" class="rank-row">
                <span class="rank-row__icon">{{ r.icon }}</span>
                <span class="rank-row__name">{{ r.title }}</span>
                <span class="rank-row__xp">{{
                  r.minXp.toLocaleString("ru-RU")
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= COMMUNITY ======= -->
    <section class="section community-section">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="eyebrow">Сообщество</span>
          <h2 class="section-head__title">Говорят наши участники</h2>
        </div>

        <div class="quotes">
          <div
            v-for="(q, i) in PEOPLE_COMMENTS"
            :key="i"
            class="quote card"
            v-reveal
          >
            <div class="quote__avatar">{{ q.avatar }}</div>
            <p class="quote__text">{{ q.text }}</p>
            <span class="quote__name">{{ q.name }}</span>
          </div>
        </div>

        <div class="cta card" v-reveal>
          <div>
            <h3>Готов (-а) выйти на берег?</h3>
            <p>
              Заведи профиль, открой карту и запишись на первую уборку. Уже
              через два клика.
            </p>
          </div>
          <div class="cta__actions">
            <RouterLink class="btn btn--gold" to="/login"
              >Создать профиль</RouterLink
            >
            <RouterLink class="btn btn--ghost" to="/about"
              >О проекте</RouterLink
            >
          </div>
        </div>
      </div>
    </section>
  </main>

  <ReserveModal
    :reserve-id="selectedReserve"
    :open="modalOpen"
    @close="modalOpen = false"
  />
</template>

<style scoped lang="scss">
/* ---------- hero ---------- */
.hero {
  position: relative;
  overflow: hidden;
  padding: 90px 0 70px;

  &__orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    &--1 {
      width: 520px;
      height: 520px;
      background: radial-gradient(
        circle,
        rgba(45, 212, 191, 0.22),
        transparent 65%
      );
      top: -180px;
      right: -120px;
    }
    &--2 {
      width: 460px;
      height: 460px;
      background: radial-gradient(
        circle,
        rgba(124, 108, 255, 0.16),
        transparent 60%
      );
      bottom: -220px;
      left: -140px;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 50px;
    align-items: center;
    position: relative;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 22px;
    align-items: flex-start;
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 999px;
    background: var(--grad-primary-soft);
    border: 1px solid var(--line-strong);
    color: var(--mint);
    font-weight: 700;
    font-size: 13px;
  }

  &__title {
    font-size: clamp(38px, 5.4vw, 62px);
    letter-spacing: -0.02em;
  }

  &__text {
    color: var(--text-dim);
    font-size: 16.5px;
    max-width: 540px;
  }

  &__actions {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  &__stats {
    display: flex;
    gap: 34px;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  &__stat {
    display: flex;
    flex-direction: column;

    b {
      font-family: var(--font-display);
      font-size: 26px;
    }
    span {
      font-size: 12.5px;
      color: var(--text-faint);
    }
  }
}

/* globe visual */
.hero__visual {
  position: relative;
  min-height: 380px;
  display: grid;
  place-items: center;
}

.globe {
  position: relative;
  width: 300px;
  height: 300px;

  &__core {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background:
      radial-gradient(
        circle at 34% 28%,
        rgba(45, 212, 191, 0.35),
        transparent 45%
      ),
      radial-gradient(
        circle at 70% 75%,
        rgba(76, 201, 255, 0.25),
        transparent 45%
      ),
      linear-gradient(150deg, #0f3a52, #0a2034 55%, #0a2c2a);
    border: 1px solid rgba(139, 224, 214, 0.35);
    box-shadow:
      inset 0 0 70px rgba(45, 212, 191, 0.18),
      0 0 90px -20px rgba(45, 212, 191, 0.5);
    animation: floaty 6s ease-in-out infinite;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background:
        repeating-linear-gradient(
          0deg,
          rgba(139, 224, 214, 0.08) 0 1px,
          transparent 1px 34px
        ),
        repeating-linear-gradient(
          90deg,
          rgba(139, 224, 214, 0.08) 0 1px,
          transparent 1px 34px
        );
      opacity: 0.5;
    }
  }

  &__core-icon {
    font-size: 88px;
    filter: drop-shadow(0 10px 26px rgba(4, 16, 26, 0.7));
    position: relative;
  }

  &__ring {
    position: absolute;
    border-radius: 50%;
    border: 1.5px dashed rgba(76, 201, 255, 0.4);
    inset: -24px;
    animation: spin 34s linear infinite;
    &--2 {
      inset: -52px;
      opacity: 0.5;
      animation-duration: 54s;
      animation-direction: reverse;
      border-color: rgba(255, 196, 77, 0.3);
    }
  }

  &__glow {
    position: absolute;
    inset: -70px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(76, 201, 255, 0.12),
      transparent 65%
    );
    filter: blur(10px);
  }
}

.satellite {
  position: absolute;
  top: 4%;
  right: 2%;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 22px;
  background: rgba(9, 24, 39, 0.9);
  border: 1px solid var(--line-strong);
  box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.6);
  animation: satellite-orbit 9s ease-in-out infinite;
}

@keyframes floaty {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-14px);
  }
}

@keyframes satellite-orbit {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(26px, 18px) rotate(12deg);
  }
  50% {
    transform: translate(-10px, 40px) rotate(-8deg);
  }
  75% {
    transform: translate(-30px, 8px) rotate(6deg);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-radius: 18px;
  background: rgba(9, 24, 39, 0.88);
  backdrop-filter: blur(12px);
  border: 1px solid var(--line-strong);
  box-shadow: 0 20px 50px -16px rgba(0, 0, 0, 0.7);
  animation: floaty 5s ease-in-out infinite;

  &__icon {
    font-size: 22px;
  }

  b {
    font-family: var(--font-display);
    font-size: 14px;
    color: var(--white);
    display: block;
  }
  span {
    font-size: 11.5px;
    color: var(--text-dim);
  }

  &--points {
    top: 8%;
    left: 2%;
    animation-delay: 0.6s;

    .float-card__icon {
      filter: drop-shadow(0 0 10px rgba(255, 196, 77, 0.8));
    }
  }

  &--level {
    bottom: 6%;
    right: 0;
    animation-delay: 1.4s;

    .float-card__icon {
      filter: drop-shadow(0 0 10px rgba(45, 212, 191, 0.8));
    }
  }
}

/* ---------- sections ---------- */
.section-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
  margin-bottom: 44px;

  &__title {
    font-size: clamp(26px, 3.4vw, 38px);
    max-width: 760px;
  }

  &__text {
    color: var(--text-dim);
    max-width: 660px;
    font-size: 15.5px;
  }
}

.eyebrow {
  padding: 7px 16px;
  border-radius: 999px;
  background: var(--grad-primary-soft);
  border: 1px solid var(--line-strong);
  color: var(--mint);
  font-weight: 700;
  font-size: 12.5px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.map-section {
  padding-block: 0;
}

.map-gate {
  height: 140px;
  background: linear-gradient(
    180deg,
    rgba(45, 212, 191, 0.35) 0%,
    rgba(45, 212, 191, 0.14) 26%,
    rgba(45, 212, 191, 0.03) 52%,
    rgba(7, 21, 35, 0.92) 80%,
    #071523 100%
  );

  &--bottom {
    background: linear-gradient(
      0deg,
      rgba(45, 212, 191, 0.3) 0%,
      rgba(45, 212, 191, 0.12) 26%,
      rgba(45, 212, 191, 0.03) 52%,
      rgba(7, 21, 35, 0.92) 80%,
      #071523 100%
    );
  }
}

.map-frame {
  position: relative;
  overflow: hidden;

  :deep(.ru-map) {
    border-radius: 0;
    border: none;
  }
}

.map-caption {
  margin-top: 56px;
  margin-bottom: 0;

  .section-head__text {
    max-width: 680px;
  }
}

.map-hint {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
  font-size: 12.5px;
  color: var(--text-faint);

  span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
}

/* ---------- steps ---------- */
.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.step {
  position: relative;
  padding: 26px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease;
  overflow: visible;

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(45, 212, 191, 0.45);
  }

  &__num {
    position: absolute;
    top: 14px;
    right: 18px;
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 800;
    color: transparent;
    -webkit-text-stroke: 1px rgba(139, 224, 214, 0.35);
  }

  &__icon {
    font-size: 34px;
  }

  &__title {
    font-size: 16px;
  }

  &__text {
    font-size: 13.5px;
    color: var(--text-dim);
    line-height: 1.55;
  }

  &__arrow {
    position: absolute;
    top: 38px;
    right: -20px;
    width: 34px;
    color: var(--text-faint);
    opacity: 0.7;
    pointer-events: none;
  }
}

/* ---------- game ---------- */
.game-layout {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 44px;
  align-items: center;
}

.game-copy {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: flex-start;

  .section-head__title {
    text-align: left;
  }
  .section-head__text {
    text-align: left;
  }
}

.game-perks {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 460px;
  margin-bottom: 6px;
}

.perk {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 4px 14px;
  align-items: center;
  padding: 14px 18px;
  border-radius: 16px;
  background: rgba(139, 224, 214, 0.05);
  border: 1px solid var(--line);

  span {
    grid-row: span 2;
    font-size: 22px;
  }
  b {
    color: var(--white);
    font-size: 14.5px;
  }
  small {
    color: var(--text-faint);
    font-size: 12px;
  }
}

.ranks {
  padding: 26px;
  background: linear-gradient(
    168deg,
    rgba(255, 196, 77, 0.07),
    rgba(9, 24, 39, 0.9)
  );

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 16px;

    h3 {
      font-size: 17px;
    }
    span {
      font-size: 11.5px;
      color: var(--text-faint);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
  }
}

.rank-row {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 11px 4px;
  border-bottom: 1px solid var(--line);

  &:last-child {
    border-bottom: none;
  }

  &__icon {
    font-size: 20px;
  }

  &__name {
    font-weight: 600;
    font-size: 13.5px;
    color: var(--text);
  }

  &__xp {
    font-family: var(--font-display);
    font-size: 12px;
    color: var(--gold);
    background: rgba(255, 196, 77, 0.1);
    border: 1px solid rgba(255, 196, 77, 0.28);
    padding: 3px 9px;
    border-radius: 999px;
  }
}

/* ---------- community ---------- */
.quotes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 26px;
}

.quote {
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__avatar {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 26px;
    background: var(--grad-primary-soft);
    border: 1px solid var(--line-strong);
  }

  &__text {
    color: var(--text);
    font-size: 15px;
    line-height: 1.6;
  }

  &__name {
    color: var(--mint);
    font-weight: 700;
    font-size: 13.5px;
  }
}

.cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 34px 38px;
  background: linear-gradient(
    140deg,
    rgba(45, 212, 191, 0.14),
    rgba(76, 201, 255, 0.08) 60%,
    rgba(9, 24, 39, 0.9)
  );

  h3 {
    font-size: 22px;
    margin-bottom: 8px;
  }
  p {
    color: var(--text-dim);
    font-size: 14.5px;
    max-width: 460px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    flex: none;
  }
}

@media (max-width: 980px) {
  .hero__grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  .hero__visual {
    min-height: 300px;
  }
  .game-layout {
    grid-template-columns: 1fr;
  }
  .map-hint {
    flex-direction: column;
  }
  .map-gate {
    height: 80px;
  }
}

@media (max-width: 820px) {
  .steps {
    grid-template-columns: repeat(2, 1fr);
  }
  .step__arrow {
    display: none;
  }
  .quotes {
    grid-template-columns: 1fr;
  }
  .cta {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 540px) {
  .steps {
    grid-template-columns: 1fr;
  }
  .hero__stat b {
    font-size: 21px;
  }
}
</style>
