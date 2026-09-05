<script setup lang="ts">
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>

<template>
  <div class="toast-host">
    <TransitionGroup name="toast">
      <div
        v-for="t in ui.toasts"
        :key="t.id"
        class="toast"
        :class="`toast--${t.type}`"
        @click="ui.remove(t.id)"
      >
        {{ t.text }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.toast-host {
  position: fixed;
  z-index: 200;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: min(560px, calc(100vw - 28px));
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  cursor: pointer;
  padding: 14px 22px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14.5px;
  background: rgba(16, 40, 58, 0.92);
  border: 1px solid var(--line-strong);
  color: var(--text);
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 46px -18px rgba(0, 0, 0, 0.7);
  text-align: center;

  &--success {
    border-color: rgba(45, 212, 191, 0.5);
    box-shadow: 0 0 30px -8px rgba(45, 212, 191, 0.4);
  }
  &--gold {
    border-color: rgba(255, 196, 77, 0.5);
    box-shadow: 0 0 30px -8px rgba(255, 196, 77, 0.4);
  }
}

.toast-enter-active {
  transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 0.22s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.92);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>