import type { LeaderUser } from './types'

export const PROJECT_STATS = {
  participants: 12480,
  kgCollected: 84200,
  reservesWatched: 145,
  pollutionSources: 14,
  cleanupsYTD: 318,
}

export const TOP_USERS: LeaderUser[] = [
  { name: 'Полина Гринева', city: 'Калининград', xp: 2470, points: 1215, level: 14 },
  { name: 'Артём Соколов', city: 'Владивосток', xp: 2290, points: 1105, level: 13 },
  { name: 'Софья Ким', city: 'Иркутск', xp: 1985, points: 960, level: 12 },
  { name: 'Марк Северин', city: 'Камчатка', xp: 1760, points: 845, level: 11 },
  { name: 'Алиса Ветрова', city: 'Сочи', xp: 1640, points: 790, level: 11 },
  { name: 'Даниил Морозов', city: 'Мурманск', xp: 1210, points: 585, level: 9 },
]

export const PEOPLE_COMMENTS = [
  {
    name: 'Аня Т.',
    text: 'Приехала на Утриш на выходные, а уехала волонтёром. Баллы и звание — мелочь, а экипаж — семья!',
    avatar: '🌊',
  },
  {
    name: 'Игорь П.',
    text: 'Организаторы подтвердили участие за час. Увидел в кабинете новый уровень — захотелось в рейс снова.',
    avatar: '⚓',
  },
]