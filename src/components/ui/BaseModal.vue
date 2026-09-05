<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    wide?: boolean
  }>(),
  { title: '', wide: false },
)

const emit = defineEmits<{ (e: 'close'): void }>()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="pop">
      <div v-if="open" class="modal-backdrop" @click.self="emit('close')">
        <div class="modal" :class="{ 'modal--wide': wide }" role="dialog" aria-modal="true">
          <div class="modal__head">
            <h3 class="modal__title">{{ title }}</h3>
            <button class="modal__close" aria-label="Закрыть" @click="emit('close')">✕</button>
          </div>
          <div class="modal__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(3, 9, 16, 0.72);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 18px;
  overflow-y: auto;
  @media (min-width: 721px) {
    align-items: center;
  }
}

.modal {
  width: 100%;
  max-width: 520px;
  max-height: min(88vh, 760px);
  overflow-y: auto;
  background: linear-gradient(168deg, #122b40, #0a2034);
  border: 1px solid var(--line-strong);
  border-radius: 22px;
  box-shadow: 0 40px 110px -30px rgba(0, 0, 0, 0.85);
  position: relative;

  &--wide {
    max-width: 760px;
  }

  &__head {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 20px 22px 14px;
    background: linear-gradient(180deg, #0f2940, rgba(15, 41, 64, 0.92) 80%, rgba(15, 41, 64, 0));
  }

  &__title {
    font-size: 20px;
  }

  &__close {
    flex: none;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid var(--line-strong);
    background: rgba(139, 224, 214, 0.08);
    color: var(--text-dim);
    font-size: 14px;
    transition: all 0.2s;
    &:hover {
      background: rgba(139, 224, 214, 0.18);
      color: var(--white);
      transform: rotate(90deg);
    }
  }

  &__body {
    padding: 4px 22px 24px;
  }
}
</style>