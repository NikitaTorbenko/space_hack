<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const router = useRouter()
const route = useRoute()

const name = ref('')
const email = ref('')
const city = ref('')

function submit() {
  user.login(name.value, email.value, city.value)
  const then = route.query.then as string | undefined
  router.push({ name: then === 'cabinet' ? 'cabinet' : 'home' })
}

function demo() {
  user.loginDemo()
  const then = route.query.then as string | undefined
  router.push({ name: then === 'cabinet' ? 'cabinet' : 'home' })
}
</script>

<template>
  <main class="auth-page">
    <div class="auth-container">
      <div class="auth-card card" v-reveal>
        <div class="auth-card__head">
          <h2 class="auth-card__title">
            Добро пожаловать
            <span class="gradient-text">на борт</span>
          </h2>
          <p class="auth-card__sub">Заведи профиль, чтобы записываться на уборки и получать баллы</p>
        </div>

        <form class="auth-form" @submit.prevent="submit">
          <label class="field">
            <span class="field__label">Имя</span>
            <input v-model="name" type="text" required placeholder="Как к тебе обращаться?" />
          </label>
          <label class="field">
            <span class="field__label">Email</span>
            <input v-model="email" type="email" required placeholder="you@example.com" />
          </label>
          <label class="field">
            <span class="field__label">Город</span>
            <input v-model="city" type="text" required placeholder="Город проживания" />
          </label>
          <button class="btn btn--primary btn--lg" type="submit">Создать профиль</button>
        </form>

        <div class="divider"><span>или</span></div>

        <button class="btn btn--gold btn--lg demo-btn" @click="demo">
          🎯 Войти как демо-участник
        </button>
        <p class="auth-hint">
          Демо-профиль уже имеет <b>640 XP</b>, достижения и завершённые уборки — идеально для
          презентации.
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.auth-page {
  min-height: calc(100vh - var(--header-h));
  display: grid;
  place-items: center;
  padding: 40px 18px;
}

.auth-container {
  width: 100%;
  max-width: 520px;
}

.auth-card {
  padding: 38px 36px;

  &__head {
    margin-bottom: 28px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  &__title {
    font-size: 30px;
  }
  &__sub {
    color: var(--text-dim);
    font-size: 14.5px;
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .btn {
    margin-top: 6px;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &__label {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  input {
    padding: 13px 18px;
    border-radius: 14px;
    background: rgba(139, 224, 214, 0.05);
    border: 1px solid var(--line-strong);
    color: var(--white);
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;

    &::placeholder {
      color: var(--text-faint);
    }

    &:focus {
      border-color: var(--teal);
      background: rgba(139, 224, 214, 0.1);
    }
  }
}

.divider {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 28px 0;
  color: var(--text-faint);
  font-size: 12.5px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--line);
  }
}

.demo-btn {
  width: 100%;
}

.auth-hint {
  text-align: center;
  margin-top: 16px;
  font-size: 12.5px;
  color: var(--text-faint);
  b {
    color: var(--gold);
  }
}

@media (max-width: 540px) {
  .auth-card {
    padding: 26px 20px;
  }
}
</style>