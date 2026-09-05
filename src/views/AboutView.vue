<script setup lang="ts">
import { PROJECT_STATS } from '@/data/misc'

const missionBlocks = [
  {
    icon: '🛰️',
    title: 'ДЗЗ и спутники',
    text: 'Данные дистанционного зондирования Земли (спутники Sentinel-2, Landsat-9) фиксируют поверхность побережий в оптическом и инфракрасном диапазоне. Команда СР Дата анализирует их на платформе Яндекс.Облака и выявляет аномалии — скопления пластика и отходов.',
  },
  {
    icon: '📚',
    title: 'Обучение',
    text: 'Проект учит понимать данные спутников. Участники узнают, как работает ДЗЗ, как выглядит загрязнение на снимках, и как эту информацию превращают в план уборки. Двери открыты для школьников и студентов от 14 лет, а также сотрудников ООПТ.',
  },
  {
    icon: '🧤',
    title: 'Уборка и мониторинг',
    text: 'После обучения участник переходит к практике: выбирает заповедник, записывается на организованную уборку, получает инвентарь и работает вместе с сотрудниками ООПТ. Затем результат фиксируется, и спутник подтверждает изменение.',
  },
]

const dzzSteps = [
  { num: 1, title: 'Снимок', desc: 'Спутник фиксирует побережье в десятках спектральных каналов' },
  { num: 2, title: 'Анализ', desc: 'ML-модель в Яндекс.Облаке выделяет аномалии (пластик, мазут, мусорные свалки)' },
  { num: 3, title: 'Карта', desc: 'Результат накладывается на карту регионов: очаги, степени, индексы' },
  { num: 4, title: 'Действие', desc: 'Волонтёры и сотрудники ООПТ получают план работ и выдвигаются на место' },
]
</script>

<template>
  <main>
    <section class="hero-about">
      <div class="hero-about__orb" aria-hidden="true"></div>
      <div class="container">
        <div class="hero-about__inner" v-reveal>
          <span class="eyebrow">О проекте «Чистый берег»</span>
          <h1 class="hero-about__title">
            Спутники видят загрязнение.
            <br />
            <span class="gradient-text">Ты — действуешь</span>
          </h1>
          <p class="hero-about__text">
            Фонд защитников природы совместно с космической IT-компанией «СР Дата» при
            технической поддержке Яндекс.Облака создали проект, который превращает данные космоса
            в реальную заботу о берегах России.
          </p>
          <div class="hero-about__actions">
            <RouterLink class="btn btn--primary" to="/">Открыть карту</RouterLink>
            <RouterLink class="btn btn--ghost" to="/login">Войти</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="eyebrow">Миссия</span>
          <h2 class="section-head__title">
            Объединить образование, науку и практику
            <span class="gradient-text">через геймификацию</span>
          </h2>
        </div>

        <div class="block-grid">
          <div v-for="(b, i) in missionBlocks" :key="i" class="block card" v-reveal :style="{ transitionDelay: i * 100 + 'ms' }">
            <span class="block__icon">{{ b.icon }}</span>
            <h3 class="block__title">{{ b.title }}</h3>
            <p class="block__text">{{ b.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section dzz-section">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="eyebrow">Как работает ДЗЗ</span>
          <h2 class="section-head__title">
            От спутника до берега — <span class="gradient-text">цепочка данных</span>
          </h2>
        </div>

        <div class="dzz-pipeline" v-reveal>
          <div v-for="s in dzzSteps" :key="s.num" class="dzz-step">
            <div class="dzz-step__num">0{{ s.num }}</div>
            <div class="dzz-step__body">
              <h4 class="dzz-step__title">{{ s.title }}</h4>
              <p class="dzz-step__text">{{ s.desc }}</p>
            </div>
            <svg v-if="s.num < 4" class="dzz-step__arrow" viewBox="0 0 40 20" aria-hidden="true">
              <path d="M2 10h32M26 4l8 6-8 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
            </svg>
          </div>
        </div>

        <div class="dzz-note card" v-reveal>
          <b>Важно:</b> данные ДЗЗ не заменяют полевые исследования, а усиливают их. Спутник подсказывает,
          где критично, а волонтёры и сотрудники ООПТ — проверяют на месте и устраняют загрязнения.
        </div>
      </div>
    </section>

    <section class="section audience-section">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="eyebrow">Для кого проект</span>
          <h2 class="section-head__title">Две аудитории — разные пути</h2>
        </div>

        <div class="audience-duo" v-reveal>
          <div class="aud card">
            <div class="aud__icon">🎒</div>
            <h3>Молодёжь от 14 лет</h3>
            <p>Интерес к экологии и современным технологиям. Путь: карта → обучение → волонтёрство → геймификация. Баллы, уровни, достижения превращают заботу о природе в осознанную привычку.</p>
            <div class="aud__tags">
              <span>Хочу узнавать новое</span>
              <span>Мне нформатика</span>
              <span>Волонтёрство + игра</span>
            </div>
          </div>
          <div class="aud card">
            <div class="aud__icon">🧑‍🌾</div>
            <h3>Сотрудники ООПТ</h3>
            <p>Профессионалы, которые уже защищают природу каждый день. Проект даёт точные данные ДЗЗ, планирование уборок и систему начисления социальных баллов для поддержания мотивации сотрудников и привлечения новых.</p>
            <div class="aud__tags">
              <span>Данные для работы</span>
              <span>Планирование</span>
              <span>Мотивация команды</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section stats-section">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="eyebrow">Цифры</span>
          <h2 class="section-head__title">Проект в числах</h2>
        </div>
        <div class="stats-grid" v-reveal>
          <div class="stat card">
            <span class="stat__num gradient-text">{{ PROJECT_STATS.participants.toLocaleString('ru-RU') }}</span>
            <span class="stat__label">участников</span>
          </div>
          <div class="stat card">
            <span class="stat__num gradient-text">{{ (PROJECT_STATS.kgCollected / 1000).toFixed(1) }} т</span>
            <span class="stat__label">отходов собрано</span>
          </div>
          <div class="stat card">
            <span class="stat__num gradient-text">{{ PROJECT_STATS.reservesWatched }}</span>
            <span class="stat__label">объектов в мониторинге</span>
          </div>
          <div class="stat card">
            <span class="stat__num gradient-text">{{ PROJECT_STATS.cleanupsYTD }}</span>
            <span class="stat__label">уборок в 2026 году</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section partners-section">
      <div class="container">
        <div class="section-head" v-reveal>
          <span class="eyebrow">Партнёры</span>
          <h2 class="section-head__title">Кто стоит за проектом</h2>
        </div>
        <div class="partner-grid" v-reveal>
          <div class="partner card">
            <h4>Фонд защитников природы</h4>
            <p>Идейный куратор, координация ООПТ и экологических экспертов</p>
          </div>
          <div class="partner card">
            <h4>СР Дата</h4>
            <p>Космическая IT-компания: обработка спутниковых данных, модели, аналитика</p>
          </div>
          <div class="partner card">
            <h4>Яндекс Облако</h4>
            <p>Техническая платформа, вычисления и хранение данных</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.hero-about {
  position: relative;
  overflow: hidden;
  padding: 100px 0 60px;

  &__orb {
    position: absolute;
    top: -160px;
    right: -200px;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(45, 212, 191, 0.18), transparent 65%);
    filter: blur(70px);
    pointer-events: none;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
    position: relative;
  }

  &__title {
    font-size: clamp(36px, 5vw, 56px);
  }
  &__text {
    color: var(--text-dim);
    font-size: 16.5px;
    max-width: 620px;
  }
  &__actions {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
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

.section-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
  margin-bottom: 44px;

  &__title {
    font-size: clamp(26px, 3.4vw, 38px);
    max-width: 720px;
  }
  &__text {
    color: var(--text-dim);
    font-size: 15px;
    max-width: 640px;
  }
}

.block-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.block {
  padding: 28px 26px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.28s ease, border-color 0.28s ease;
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(45, 212, 191, 0.45);
  }
  &__icon {
    font-size: 36px;
  }
  &__title {
    font-size: 18px;
  }
  &__text {
    color: var(--text-dim);
    font-size: 14px;
    line-height: 1.6;
  }
}

.dzz-pipeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 34px;
}

.dzz-step {
  position: relative;
  background: rgba(9, 24, 39, 0.7);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__num {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 800;
    -webkit-text-stroke: 1px rgba(139, 224, 214, 0.4);
    color: transparent;
  }
  &__title {
    font-size: 16px;
    color: var(--mint);
  }
  &__text {
    font-size: 13.5px;
    color: var(--text-dim);
    line-height: 1.5;
  }
  &__arrow {
    position: absolute;
    top: 50%;
    right: -20px;
    width: 30px;
    color: var(--text-faint);
    opacity: 0.7;
    pointer-events: none;
  }
}

.dzz-note {
  padding: 22px 26px;
  font-size: 14px;
  color: var(--text-dim);
  border-left: 4px solid var(--teal);
  border-radius: 6px;
  b {
    color: var(--white);
    margin-right: 8px;
  }
}

.audience-duo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.aud {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__icon {
    font-size: 36px;
  }
  h3 {
    font-size: 18px;
  }
  p {
    color: var(--text-dim);
    font-size: 14px;
  }
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;

    span {
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(76, 201, 255, 0.1);
      border: 1px solid rgba(76, 201, 255, 0.28);
      color: var(--cyan);
      font-size: 12px;
      font-weight: 600;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.stat {
  text-align: center;
  padding: 30px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__num {
    font-family: var(--font-display);
    font-size: clamp(28px, 3vw, 42px);
    font-weight: 800;
  }
  &__label {
    color: var(--text-faint);
    font-size: 13px;
  }
}

.partner-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.partner {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  h4 {
    font-size: 17px;
    color: var(--white);
  }
  p {
    color: var(--text-dim);
    font-size: 14px;
  }
}

@media (max-width: 920px) {
  .block-grid,
  .partner-grid {
    grid-template-columns: 1fr;
  }
  .dzz-pipeline {
    grid-template-columns: repeat(2, 1fr);
  }
  .audience-duo,
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 620px) {
  .dzz-pipeline,
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .dzz-step__arrow {
    display: none;
  }
}
</style>