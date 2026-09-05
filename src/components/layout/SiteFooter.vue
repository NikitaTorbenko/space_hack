<script setup lang="ts">
const partners = [
  { name: 'Фонд защитников природы', role: 'идейный партнёр' },
  { name: 'СР Дата', role: 'космические данные' },
  { name: 'Яндекс Облако', role: 'техническая платформа' },
]
</script>

<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__about">
        <div class="brand">
          <span class="brand__mark">🌊</span>
          <span class="brand__name">Чистый берег</span>
        </div>
        <p class="footer__text">
          Спутниковый мониторинг, обучение и уборка морских побережий России. Данные дистанционного
          зондирования Земли помогают находить загрязнения и превращают заботу о береге в игру.
        </p>
        <div class="footer__story">
          <span>Сделано на хакатоне</span>
          <span class="dot">•</span>
          <span>идея — фонд + космос</span>
        </div>
      </div>

      <div class="footer__col">
        <h4 class="footer__title">Разделы</h4>
        <RouterLink to="/" class="footer__link">Интерактивная карта</RouterLink>
        <RouterLink to="/about" class="footer__link">О проекте</RouterLink>
        <RouterLink to="/login" class="footer__link">Вход в кабинет</RouterLink>
        <RouterLink to="/cabinet" class="footer__link">Личный кабинет</RouterLink>
      </div>

      <div class="footer__col">
        <h4 class="footer__title">Партнёры</h4>
        <div v-for="p in partners" :key="p.name" class="footer__partner">
          <span class="footer__partner-name">{{ p.name }}</span>
          <span class="footer__partner-role">{{ p.role }}</span>
        </div>
      </div>
    </div>

    <div class="container footer__bottom">
      <span>© 2026 «Чистый берег» — демонстрационный прототип</span>
      <span>Все данные проекта — моковые, для презентации</span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  margin-top: auto;
  border-top: 1px solid var(--line);
  background: linear-gradient(180deg, transparent, rgba(4, 11, 18, 0.85));
  padding-top: 56px;

  &__grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 40px;
    padding-bottom: 44px;
  }

  &__about {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__text {
    color: var(--text-dim);
    font-size: 14px;
    max-width: 420px;
  }

  &__story {
    display: flex;
    gap: 8px;
    font-size: 12.5px;
    color: var(--text-faint);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 7px 14px;
    align-self: flex-start;
    .dot {
      color: var(--teal);
    }
  }

  &__col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__title {
    font-family: var(--font-display);
    font-size: 13px;
    color: var(--mint);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  &__link {
    color: var(--text-dim);
    font-size: 14px;
    width: fit-content;
    transition: color 0.2s, transform 0.2s;
    &:hover {
      color: var(--white);
      transform: translateX(4px);
    }
  }

  &__partner {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  &__partner-name {
    font-weight: 700;
    font-size: 14px;
    color: var(--text);
  }
  &__partner-role {
    font-size: 12.5px;
    color: var(--text-faint);
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    color: var(--text-faint);
    font-size: 12.5px;
    padding-block: 22px;
    border-top: 1px solid var(--line);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .brand__mark {
    font-size: 26px;
  }
  .brand__name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 17px;
    color: var(--white);
  }
}

@media (max-width: 820px) {
  .footer__grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>