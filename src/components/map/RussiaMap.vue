<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import {
  geoNaturalEarth1,
  geoGraticule10,
  geoPath,
  geoClipCircle,
  geoContains,
  type GeoProjection,
} from 'd3-geo'
import russiaUrl from '@/assets/data/russia_regions.json?url'
import type { PollutionLevel, PollutionPoint, Reserve } from '@/data/types'
import { POLLUTION_LEVELS, POLLUTION_POINTS } from '@/data/pollution'
import { RESERVES } from '@/data/reserves'

const W = 1040
const H = 660
const PAD = 46

const emit = defineEmits<{
  (e: 'select-reserve', id: string): void
}>()

type LevelFilter = 'all' | PollutionLevel

const levelFilter = ref<LevelFilter>('all')
const showReserves = ref(true)
const loading = ref(true)

interface PlacedMarker {
  x: number
  y: number
  item: PollutionPoint
}
interface PlacedReserve {
  x: number
  y: number
  item: Reserve
}
interface RegionRow {
  name: string
  d: string
  fill: string
}

let geojsonCache: unknown = null
const projectionRef = shallowRef<GeoProjection>(geoNaturalEarth1())
const graticulePath = shallowRef<string | null>(null)
const regions = shallowRef<RegionRow[]>([])
const placedPollutions = ref<PlacedMarker[]>([])
const placedReserves = ref<PlacedReserve[]>([])

const hoverHover = ref<{
  kind: 'pollution' | 'reserve'
  id: string
  left: number
  top: number
  below: boolean
  arrowPct: number
} | null>(null)

const regionTooltip = ref<{ name: string; x: number; y: number } | null>(null)

const visiblePollutions = computed(() =>
  POLLUTION_POINTS.filter((p) => levelFilter.value === 'all' || p.level === levelFilter.value),
)

const filterLegend = [
  { key: 'severe' as PollutionLevel, label: 'Критично', color: '#ff5b5f' },
  { key: 'medium' as PollutionLevel, label: 'Средне', color: '#ffb020' },
  { key: 'low' as PollutionLevel, label: 'Лёгкая', color: '#3ddc7a' },
]

async function loadMap() {
  try {
    if (!geojsonCache) {
      const res = await fetch(russiaUrl)
      geojsonCache = await res.json()
    }
    buildMap(geojsonCache)
  } finally {
    loading.value = false
  }
}

function buildMap(geo: unknown) {
  const projection = geoNaturalEarth1()
    .rotate([-105, -60, 0])
    .preclip(geoClipCircle(90))
  projection.fitExtent(
    [
      [PAD, PAD],
      [W - PAD, H - PAD],
    ],
    geo as never,
  )
  projectionRef.value = projection
  const path = geoPath(projection)
  graticulePath.value = path(geoGraticule10()) ?? null

  const features = (geo as { features: unknown[] }).features as Array<{
    type: string
    geometry: unknown
    properties: { name?: string }
  }>

  const scoreByRegion = new Map<string, number>()
  POLLUTION_POINTS.forEach((pt) => {
    const host = features.find((f) => geoContains(f as never, [pt.coords.lng, pt.coords.lat]))
    if (host) {
      const name = String(host.properties?.name ?? '')
      scoreByRegion.set(name, (scoreByRegion.get(name) ?? 0) + POLLUTION_LEVELS[pt.level].weight)
    }
  })
  const maxScore = Math.max(1, ...scoreByRegion.values())

  regions.value = features.map((f) => {
    const name = String(f.properties?.name ?? '')
    const d = path(f as never) ?? ''
    const fill = heatColor(scoreByRegion.get(name) ?? 0, maxScore)
    return { name, d, fill }
  })

  placedPollutions.value = visiblePollutions.value.map((item) => {
    const pos = projection([item.coords.lng, item.coords.lat])
    const [x, y] = pos ?? [0, 0]
    return { x, y, item }
  })
  placedReserves.value = RESERVES.map((item) => {
    const pos = projection([item.coords.lng, item.coords.lat])
    const [x, y] = pos ?? [0, 0]
    return { x, y, item }
  })
}

function heatColor(score: number, max: number): string {
  if (score <= 0) return '#102736'
  const t = (score - 1) / max
  const c1 = [94, 205, 178]
  const c2 = [235, 170, 76]
  const c3 = [232, 88, 76]
  const c = t < 0.5 ? mix(c1, c2, t * 2) : mix(c2, c3, (t - 0.5) * 2)
  return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},0.68)`
}

function mix(a: number[], b: number[], t: number): number[] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function applyFilter(next: LevelFilter) {
  levelFilter.value = next
  hideHover()
  const projection = projectionRef.value
  placedPollutions.value = visiblePollutions.value.map((item) => {
    const pos = projection([item.coords.lng, item.coords.lat])
    const [x, y] = pos ?? [0, 0]
    return { x, y, item }
  })
}

function toggleReserves() {
  showReserves.value = !showReserves.value
}

function showPollutionTooltip(m: PlacedMarker) {
  placeTooltip('pollution', m.item.id, m.x, m.y)
}

function showReserveTooltip(m: PlacedReserve) {
  placeTooltip('reserve', m.item.id, m.x, m.y - 15)
}

const svgRef = ref<SVGSVGElement | null>(null)

function placeTooltip(kind: 'pollution' | 'reserve', id: string, vx: number, vy: number) {
  const el = svgRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const fx = r.width / W
  const fy = r.height / H
  const pad = 16
  const boxW = Math.min(300, r.width - pad * 2)
  const centerX = vx * fx
  const halfW = boxW / 2
  const left = Math.min(
    Math.max(centerX, pad + halfW),
    Math.max(pad + halfW, r.width - halfW - pad),
  )
  const arrowPct = Math.min(92, Math.max(8, 50 + ((centerX - left) / boxW) * 100))
  const top = vy * fy
  const below = top < 240
  clearHoverTimer()
  regionTooltip.value = null
  hoverHover.value = { kind, id, left, top, below, arrowPct }
}

function onReserveClick(id: string) {
  emit('select-reserve', id)
}

let hideTimer: ReturnType<typeof setTimeout> | undefined

function clearHoverTimer() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = undefined
  }
}

function hideHover() {
  clearHoverTimer()
  hoverHover.value = null
}

function scheduleHideHover() {
  clearHoverTimer()
  hideTimer = setTimeout(() => {
    hideTimer = undefined
    hoverHover.value = null
  }, 180)
}

function onDocClick() {
  clearHoverTimer()
  hoverHover.value = null
  regionTooltip.value = null
}

function showRegion(name: string, ev: MouseEvent) {
  if (!name) return
  const el = mapHolder.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = Math.min(90, Math.max(10, ((ev.clientX - rect.left) / rect.width) * 100))
  const y = Math.min(86, Math.max(14, ((ev.clientY - rect.top) / rect.height) * 100))
  clearHoverTimer()
  hoverHover.value = null
  regionTooltip.value = { name, x, y }
}

function hideRegion() {
  regionTooltip.value = null
}

function pollById(id: string): PollutionPoint | undefined {
  return POLLUTION_POINTS.find((p) => p.id === id)
}
function reserveById(id: string): Reserve | undefined {
  return RESERVES.find((r) => r.id === id)
}

const mapHolder = ref<HTMLElement | null>(null)

onMounted(() => {
  document.addEventListener('click', onDocClick)
  loadMap()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  clearHoverTimer()
  placedPollutions.value = []
  placedReserves.value = []
})
</script>

<template>
  <div ref="mapHolder" class="ru-map" :class="{ 'ru-map--loading': loading }">
    <div v-if="loading" class="ru-map__skeleton">
      <span class="skeleton-pulse"></span>
      <p>Подключаемся к спутнику и загружаем карту…</p>
    </div>

    <template v-else>
      <svg ref="svgRef" class="ru-map__svg" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Карта загрязнений берегов России" @click="onDocClick">
        <defs>
          <radialGradient id="ocean-glow" cx="50%" cy="46%" r="62%">
            <stop offset="0%" stop-color="#0d2c40" />
            <stop offset="55%" stop-color="#071a29" />
            <stop offset="100%" stop-color="#050f1b" />
          </radialGradient>
          <filter id="marker-glow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="rm-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#38e0c5" />
            <stop offset="100%" stop-color="#2f9fd8" />
          </linearGradient>
        </defs>

        <rect :width="W" :height="H" fill="url(#ocean-glow)" rx="16" />

        <g class="graticule">
          <path v-if="graticulePath" :d="graticulePath" fill="none" stroke="rgba(139,224,214,0.06)" stroke-width="0.8" />
        </g>

        <g class="regions" @mouseleave="hideRegion">
          <path
            v-for="r in regions"
            :key="r.name"
            :d="r.d"
            :fill="r.fill"
            stroke="rgba(120, 210, 205, 0.25)"
            stroke-width="0.9"
            class="region"
            @mouseenter="showRegion(r.name, $event)"
          />
        </g>

        <g v-if="showReserves" class="reserve-markers">
          <g
            v-for="m in placedReserves"
            :key="m.item.id"
            class="rm"
            :class="{ 'rm--high': m.item.pollution === 'severe' }"
            :transform="`translate(${m.x},${m.y - 15})`"
            @click.stop="onReserveClick(m.item.id)"
            @mouseenter="showReserveTooltip(m)"
            @mouseleave="scheduleHideHover"
          >
            <circle class="rm__ring" r="17" />
            <path
              class="rm__pin"
              d="M0,-21 C-8.5,-21 -14,-14.5 -14,-7 C-14,1 -6,9.5 0,15.4 C6,9.5 14,1 14,-7 C14,-14.5 8.5,-21 0,-21 Z"
              filter="url(#marker-glow)"
            />
            <circle class="rm__dot" cx="0" cy="-7" r="4.4" />
            <circle class="rm__hit" r="18" />
          </g>
        </g>

        <g class="pollution-markers">
          <g
            v-for="m in placedPollutions"
            :key="m.item.id"
            class="pm"
            :class="`pm--${m.item.level}`"
            :transform="`translate(${m.x},${m.y})`"
            @click.stop="showPollutionTooltip(m)"
            @mouseenter="showPollutionTooltip(m)"
            @mouseleave="scheduleHideHover"
          >
            <circle class="pm__pulse" r="10" />
            <circle class="pm__core" r="4.6" :fill="POLLUTION_LEVELS[m.item.level].color" filter="url(#marker-glow)" />
            <circle class="pm__hit" r="13" />
          </g>
        </g>
      </svg>

      <div v-if="regionTooltip" class="ru-map__tooltip ru-map__tooltip--region" :style="{ left: regionTooltip.x + '%', top: regionTooltip.y + '%' }">
        {{ regionTooltip.name }}
      </div>

      <div
        v-if="hoverHover && hoverHover.kind === 'pollution'"
        class="ru-map__tooltip ru-map__tooltip--pin"
        :class="{ 'ru-map__tooltip--below': hoverHover.below }"
        :style="{ left: hoverHover.left + 'px', top: hoverHover.top + 'px', '--arrow-x': hoverHover.arrowPct + '%' }"
        @click.stop
        @mouseenter="clearHoverTimer"
        @mouseleave="hideHover"
      >
        <div class="tt" v-if="pollById(hoverHover.id)" :style="{ '--tt-accent': POLLUTION_LEVELS[pollById(hoverHover.id)!.level].color }">
          <div class="tt__row">
            <span class="tt__level" :style="{ background: POLLUTION_LEVELS[pollById(hoverHover.id)!.level].color }">
              {{ POLLUTION_LEVELS[pollById(hoverHover.id)!.level].label }}
            </span>
            <span class="tt__region">{{ pollById(hoverHover.id)!.region }}</span>
          </div>
          <p class="tt__text">{{ pollById(hoverHover.id)!.description }}</p>
          <div class="tt__meta">
            <span>🧃 ≈ {{ pollById(hoverHover.id)!.plasticKg }} кг пластика</span>
            <span>🛰️ {{ pollById(hoverHover.id)!.source }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="hoverHover && hoverHover.kind === 'reserve'"
        class="ru-map__tooltip ru-map__tooltip--pin"
        :class="{ 'ru-map__tooltip--below': hoverHover.below }"
        :style="{ left: hoverHover.left + 'px', top: hoverHover.top + 'px', '--arrow-x': hoverHover.arrowPct + '%' }"
        @click.stop
        @mouseenter="clearHoverTimer"
        @mouseleave="hideHover"
      >
        <div class="tt" v-if="reserveById(hoverHover.id)" style="--tt-accent: var(--teal)">
          <div class="tt__row">
            <span class="tt__badge">🌿 заповедник</span>
            <span class="tt__level" :style="{ background: POLLUTION_LEVELS[reserveById(hoverHover.id)!.pollution].color }">
              {{ POLLUTION_LEVELS[reserveById(hoverHover.id)!.pollution].label }}
            </span>
          </div>
          <p class="tt__name">{{ reserveById(hoverHover.id)!.name }}</p>
          <span class="tt__cta">Нажми — запишись на уборку →</span>
        </div>
      </div>

      <div v-if="showReserves" class="ru-map__reserves-badge">
        <span>🛡️</span>
        <span>заповедников</span>
        <b>{{ placedReserves.length }}</b>
      </div>

      <div class="ru-map__legend">
        <div class="ru-map__legend-title">Данные спутников ДЗЗ</div>
        <div v-for="f in filterLegend" :key="f.key" class="ru-map__legend-row">
          <span class="ru-map__legend-dot" :style="{ background: f.color }"></span>
          <span>{{ f.label }} загрязнение</span>
        </div>
        <div class="ru-map__legend-row">
          <span class="ru-map__legend-dot ru-map__legend-dot--pin">🌿</span>
          <span>Заповедник — сюда на уборку</span>
        </div>
      </div>

      <div class="ru-map__filters">
        <button class="chip" :class="{ 'chip--active': levelFilter === 'all' }" @click="applyFilter('all')">
          Все очаги <b>{{ POLLUTION_POINTS.length }}</b>
        </button>
        <button
          v-for="f in filterLegend"
          :key="f.key"
          class="chip"
          :class="{ 'chip--active': levelFilter === f.key }"
          @click="applyFilter(f.key)"
        >
          <span class="chip-dot" :style="{ background: f.color }"></span>
          {{ f.label }}
        </button>
        <button class="chip" :class="{ 'chip--active': showReserves }" @click="toggleReserves">
          🛡️ заповедники
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.ru-map {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid var(--line-strong);
  background:
    radial-gradient(60% 60% at 50% 46%, rgba(45, 212, 191, 0.05), transparent 70%),
    #071523;
  box-shadow: var(--shadow-card), inset 0 0 90px -40px rgba(45, 212, 191, 0.45);
  min-height: 480px;

  &__svg {
    width: 100%;
    height: auto;
    display: block;
  }

  &__skeleton {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    color: var(--text-dim);
    font-size: 14px;
  }
}

.skeleton-pulse {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.2), transparent 70%);
  animation: breath 1.6s ease-in-out infinite;
}

@keyframes breath {
  0%, 100% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 1; }
}

.region {
  cursor: pointer;
  transition: fill 0.25s ease, filter 0.25s ease;
  &:hover {
    filter: brightness(1.35) drop-shadow(0 0 10px rgba(94, 240, 198, 0.6));
  }
}

.graticule path {
  pointer-events: none;
}

.pm {
  cursor: pointer;

  &__core {
    stroke: rgba(255, 255, 255, 0.85);
    stroke-width: 1.2;
  }

  &--severe .pm__pulse {
    stroke: #ff5b5f;
    animation: pulse-red 1.7s ease-out infinite;
  }
  &--medium .pm__pulse {
    stroke: #ffb020;
    animation: pulse-amber 2.1s ease-out infinite;
  }
  &--low .pm__pulse {
    stroke: #3ddc7a;
    animation: pulse-green 2.5s ease-out infinite;
  }

  &:hover .pm__core {
    stroke: #fff;
  }
}

@keyframes pulse-red {
  0% { r: 8; opacity: 0.85; }
  70% { r: 19; opacity: 0; }
  100% { r: 19; opacity: 0; }
}
@keyframes pulse-amber {
  0% { r: 8; opacity: 0.8; }
  70% { r: 16; opacity: 0; }
  100% { r: 16; opacity: 0; }
}
@keyframes pulse-green {
  0% { r: 7; opacity: 0.7; }
  70% { r: 13; opacity: 0; }
  100% { r: 13; opacity: 0; }
}

.rm {
  cursor: pointer;

  &__ring {
    fill: none;
    stroke: rgba(76, 201, 255, 0.75);
    stroke-width: 1.6;
    animation: rm-ripple 2.4s ease-out infinite;
  }
  &__pin {
    fill: url(#rm-grad);
    fill-opacity: 0.95;
    stroke: rgba(215, 250, 242, 0.75);
    stroke-width: 1.2;
    transform-origin: center;
    transition: transform 0.2s ease;
  }
  &__dot {
    fill: #0a2034;
  }

  &:hover .rm__pin {
    transform: scale(1.14) translateY(-2px);
  }
  &--high .rm__ring {
    stroke: rgba(255, 91, 95, 0.7);
    animation-duration: 1.6s;
  }
}

@keyframes rm-ripple {
  0% { r: 13; opacity: 0.9; }
  70% { r: 24; opacity: 0; }
  100% { r: 24; opacity: 0; }
}

.ru-map__legend {
  position: absolute;
  left: 16px;
  bottom: 16px;
  z-index: 5;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(8, 22, 36, 0.82);
  backdrop-filter: blur(10px);
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 12.5px;
  color: var(--text-dim);
  pointer-events: none;

  &-title {
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-faint);
    margin-bottom: 2px;
  }
  &-row {
    display: flex;
    align-items: center;
    gap: 9px;
  }
  &-dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    flex: none;
    &--pin {
      display: grid;
      place-items: center;
      font-size: 10px;
      background: rgba(76, 201, 255, 0.25);
      border: 1px solid rgba(76, 201, 255, 0.5);
    }
  }
}

.ru-map__filters {
  position: absolute;
  top: 14px;
  left: 16px;
  z-index: 5;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  pointer-events: none;
}

.chip {
  cursor: pointer;
  transition: all 0.2s;
  pointer-events: auto;
  b {
    color: var(--mint);
    margin-left: 2px;
  }
}

.chip-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.ru-map__reserves-badge {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 5;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 999px;
  background: rgba(8, 22, 36, 0.82);
  backdrop-filter: blur(10px);
  border: 1px solid var(--line);
  font-size: 13px;
  color: var(--text-dim);

  b {
    color: var(--cyan);
    font-size: 15px;
  }
}

.ru-map__tooltip {
  position: absolute;
  z-index: 40;
  pointer-events: none;
  width: 300px;
  max-width: calc(100% - 40px);

  &--pin {
    pointer-events: auto;
    transform: translate(-50%, calc(-100% - 18px));
    animation: tt-in 0.16s ease both;

    &::after {
      content: '';
      position: absolute;
      left: var(--arrow-x, 50%);
      bottom: -7px;
      transform: translateX(-50%) rotate(45deg);
      width: 12px;
      height: 12px;
      background: rgba(9, 24, 39, 0.94);
      border-right: 1px solid var(--line-strong);
      border-bottom: 1px solid var(--line-strong);
      border-bottom-right-radius: 2px;
      z-index: -1;
    }

    &.ru-map__tooltip--below {
      transform: translate(-50%, 18px);
      &::after {
        top: -7px;
        bottom: auto;
        border: 0;
        border-top: 1px solid var(--line-strong);
        border-left: 1px solid var(--line-strong);
        border-top-left-radius: 2px;
      }
    }
  }

  &--region {
    width: auto;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(8, 22, 36, 0.9);
    border: 1px solid var(--line);
    font-size: 12.5px;
    color: var(--text);
    pointer-events: none;
    transform: translate(-50%, -130%);
    white-space: nowrap;
  }
}

@keyframes tt-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.pm__hit,
.rm__hit {
  fill: none;
  pointer-events: all;
  cursor: pointer;
}

.tt {
  --tt-accent: var(--teal);
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(9, 24, 39, 0.94);
  backdrop-filter: blur(14px);
  border: 1px solid var(--line-strong);
  border-top: 3px solid var(--tt-accent);
  box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 9px;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  &__level {
    color: #0a1420;
    font-weight: 800;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 999px;
  }
  &__region,
  &__badge {
    font-size: 12px;
    color: var(--text-dim);
  }
  &__badge {
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(76, 201, 255, 0.12);
    color: var(--cyan);
    border: 1px solid rgba(76, 201, 255, 0.3);
  }
  &__text {
    font-size: 12.5px;
    color: var(--text-dim);
    line-height: 1.5;
  }
  &__meta {
    display: flex;
    flex-direction: column;
    gap: 3px;
    font-size: 11.5px;
    color: var(--text-faint);
  }
  &__name {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    color: var(--white);
  }
  &__cta {
    font-size: 12px;
    font-weight: 700;
    color: var(--mint);
  }
}

@media (max-width: 720px) {
  .ru-map {
    min-height: 0;
  }
  .ru-map__legend {
    display: none;
  }
  .ru-map__filters {
    left: 10px;
    right: 10px;
    top: 10px;
    flex-wrap: wrap;
    .chip {
      font-size: 11.5px;
      padding: 6px 11px;
    }
  }
  .ru-map__reserves-badge {
    top: auto;
    bottom: 12px;
    right: 12px;
  }
}
</style>