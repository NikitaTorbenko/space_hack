<script setup lang="ts">
import SiteHeader from './components/layout/SiteHeader.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import ToastHost from './components/ui/ToastHost.vue'
</script>

<template>
  <SiteHeader />
  <ToastHost />
  <RouterView />
  <SiteFooter />
</template>

