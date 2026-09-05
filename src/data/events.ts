import type { CleanupEvent, PollutionLevel } from './types'
import { RESERVES } from './reserves'
import { POLLUTION_LEVELS } from './pollution'

const REWARDS: Record<PollutionLevel, { points: number; xp: number; kg: number }> = {
  severe: { points: 60, xp: 90, kg: 34 },
  medium: { points: 40, xp: 60, kg: 18 },
  low: { points: 25, xp: 38, kg: 9 },
}

const DAY_NAMES = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']

export function dateWithOffset(offset: number): { iso: string; label: string } {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const iso = d.toISOString().slice(0, 10)
  const label = `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${DAY_NAMES[d.getDay()]}`
  return { iso, label }
}

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

interface EventTemplate {
  reserveId: string
  offset: number
  time: string
  meetPoint: string
  title: string
  description: string
  slots: number
  baseJoined: number
}

const TEMPLATES: EventTemplate[] = [
  {
    reserveId: 'res-utrish',
    offset: 4,
    time: '10:00',
    meetPoint: 'Вход на тропу «Большой Утриш», парковка набережной',
    title: 'Чёрноморский десант',
    description: 'Прибрежная полоса заповедника, маршрут 3 км. Организаторы выдадут инвентарь и перчатки.',
    slots: 30,
    baseJoined: 21,
  },
  {
    reserveId: 'res-utrish',
    offset: 11,
    time: '09:30',
    meetPoint: 'Автостанция Утриша, остановка «Заповедник»',
    title: 'Чистый прибой',
    description: 'Уборка пляжной зоны и реликтового леса от нанесённого пластика.',
    slots: 40,
    baseJoined: 33,
  },
  {
    reserveId: 'res-astrahansky',
    offset: 6,
    time: '09:30',
    meetPoint: 'Смотровая площадка «Трёхизбинка», дельта Волги',
    title: 'Лотосовая акватория',
    description: 'Расчистка берега протоки рядом с лотосовыми полями. Часть маршрута на моторных лодках.',
    slots: 25,
    baseJoined: 12,
  },
  {
    reserveId: 'res-astrahansky',
    offset: 18,
    time: '11:00',
    meetPoint: 'Причал кордона «Дамчикский»',
    title: 'Дамчикский экобриг',
    description: 'Прибрежная полоса у кордона, сбор намывного тростника и бытовых отходов.',
    slots: 20,
    baseJoined: 6,
  },
  {
    reserveId: 'res-kronotsky',
    offset: 9,
    time: '10:00',
    meetPoint: 'Визит-центр Кроноцкого заповедника, Елизово (трансфер)',
    title: 'Кроноцкий патруль',
    description: 'Контрольный обход участка Кроноцкого залива после сезонного намыва мусора.',
    slots: 16,
    baseJoined: 10,
  },
  {
    reserveId: 'res-kronotsky',
    offset: 24,
    time: '11:00',
    meetPoint: 'Долина гейзеров, туристическая база',
    title: 'Гейзерный маршрут',
    description: 'Мониторинг и уборка туристических стоянок в буферной зоне.',
    slots: 14,
    baseJoined: 5,
  },
  {
    reserveId: 'res-baikal',
    offset: 5,
    time: '12:00',
    meetPoint: 'Бухта Песчаная, визит-центр',
    title: 'Байкальская волна',
    description: 'Уборка бухты Песчаной и тропы Большой Байкальской. Красивейший участок побережья.',
    slots: 36,
    baseJoined: 27,
  },
  {
    reserveId: 'res-baikal',
    offset: 16,
    time: '13:00',
    meetPoint: 'Пос. Танхой, инфоцентр заповедника',
    title: 'Южный берег',
    description: 'Прибрежная зона Хамар-Дабана вдоль Кругобайкальской железной дороги.',
    slots: 28,
    baseJoined: 19,
  },
  {
    reserveId: 'res-fem',
    offset: 7,
    time: '10:00',
    meetPoint: 'Причал острова Попова',
    title: 'Островной флот',
    description: 'Уборка пляжей острова Попова в акватории Дальневосточного морского заповедника.',
    slots: 32,
    baseJoined: 24,
  },
  {
    reserveId: 'res-fem',
    offset: 21,
    time: '09:30',
    meetPoint: 'Владивосток, наб. Спортивной гавани',
    title: 'Залив Петра Великого',
    description: 'Береговой маршрут 4 км вдоль заповедной акватории.',
    slots: 40,
    baseJoined: 31,
  },
  {
    reserveId: 'res-lazovsky',
    offset: 13,
    time: '11:00',
    meetPoint: 'С. Лазо, визит-центр',
    title: 'Тигриная тропа',
    description: 'Уборка морского побережья у охранной зоны заповедника.',
    slots: 22,
    baseJoined: 9,
  },
  {
    reserveId: 'res-kandalaksha',
    offset: 8,
    time: '10:00',
    meetPoint: 'Кандалакша, порт, сбор группы',
    title: 'Острова Белого моря',
    description: 'Десант на острова архипелага, сбор частей рыбацких сетей выносимых течением.',
    slots: 18,
    baseJoined: 11,
  },
  {
    reserveId: 'res-kandalaksha',
    offset: 26,
    time: '12:00',
    meetPoint: 'Полярный круг, причал',
    title: 'Северный прилив',
    description: 'Прибрежная зона у границы заповедника, мониторинг гагачьих колоний.',
    slots: 15,
    baseJoined: 4,
  },
  {
    reserveId: 'res-kurshskaya',
    offset: 3,
    time: '11:00',
    meetPoint: 'Нацпарк, кордон «Морское»',
    title: 'Дюнный маршрут',
    description: 'Уборка дюнного побережья Балтики от Королевского бора до Морского.',
    slots: 45,
    baseJoined: 38,
  },
  {
    reserveId: 'res-kurshskaya',
    offset: 14,
    time: '10:00',
    meetPoint: 'Вход в нацпарк с Зеленоградска',
    title: 'Балтийский ветер',
    description: 'Совместная уборка с орнитологической станцией «Фрингилла».',
    slots: 30,
    baseJoined: 17,
  },
  {
    reserveId: 'res-wrangel',
    offset: 30,
    time: '10:00',
    meetPoint: 'Певек, вертолётная площадка (по согласованию)',
    title: 'Арктический дозор',
    description: 'Научная экспедиция-уборка на острове Врангеля. Участие по спец-отбору.',
    slots: 8,
    baseJoined: 3,
  },
  {
    reserveId: 'res-komandorsky',
    offset: 35,
    time: '11:00',
    meetPoint: 'Никольское, инфоцентр',
    title: 'Командорский дозор',
    description: 'Уборка побережья о. Беринга в районе лежбищ морских котиков.',
    slots: 14,
    baseJoined: 5,
  },
  {
    reserveId: 'res-pechoro',
    offset: 12,
    time: '09:30',
    meetPoint: 'Якша, кордон заповедника',
    title: 'Истоки Печоры',
    description: 'Прибрежная зона и экосплавные стоянки верховий Печоры.',
    slots: 20,
    baseJoined: 7,
  },
  {
    reserveId: 'res-gedansky',
    offset: 29,
    time: '10:00',
    meetPoint: 'Салехард, сбор группы + трансфер',
    title: 'Тундровый рейд',
    description: 'Мониторинг и уборка побережья Карского моря в охранной зоне.',
    slots: 12,
    baseJoined: 4,
  },
]

export const EVENTS: CleanupEvent[] = TEMPLATES.map((t, i) => {
  const reserve = RESERVES.find((r) => r.id === t.reserveId)!
  const reward = REWARDS[reserve.pollution]
  const { iso, label } = dateWithOffset(t.offset)
  return {
    id: `ev-${i + 1}`,
    reserveId: t.reserveId,
    reserveName: reserve.name,
    title: t.title,
    dateISO: iso,
    dateLabel: label,
    dayOffset: t.offset,
    time: t.time,
    meetPoint: t.meetPoint,
    description: t.description,
    slots: t.slots,
    baseJoined: t.baseJoined,
    rewardPoints: reward.points,
    rewardXp: reward.xp,
    pollution: reserve.pollution,
  }
})

export function eventKgByLevel(level: PollutionLevel): number {
  return REWARDS[level].kg
}

export function eventsForReserve(reserveId: string): CleanupEvent[] {
  return EVENTS.filter((e) => e.reserveId === reserveId)
}

export function getEvent(id: string): CleanupEvent | undefined {
  return EVENTS.find((e) => e.id === id)
}

export function pollutionLabel(level: PollutionLevel): string {
  return POLLUTION_LEVELS[level].label
}