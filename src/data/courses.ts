import type { Course } from './types'

export const COURSES: Course[] = [
  {
    id: 'course-eco-basics',
    title: 'Экология морских побережий',
    icon: '🌊',
    category: 'Базовый',
    description: 'Что такое прибрежная экосистема и откуда берётся мусор на берегу.',
    lessons: [
      'Что такое прибрежная экосистема',
      'Откуда берётся мусор на берегу',
      'Как оценить очаг загрязнения',
      'Тест: задание смотрителя',
    ],
    min: 35,
    rewardPoints: 20,
    rewardXp: 35,
  },
  {
    id: 'course-remote-sensing',
    title: 'Язык спутников: читаем ДЗЗ',
    icon: '🛰️',
    category: 'Продвинутый',
    description: 'Учимся видеть свалки глазами Sentinel-2 и Landsat-9 и работать с картами.',
    lessons: [
      'Спектры и каналы Sentinel-2',
      'Как выглядит свалка из космоса',
      'Индекс NDVI и ещё 4 формулы',
      'Практика на реальном снимке',
      'Итоговый тест по картам',
    ],
    min: 45,
    rewardPoints: 40,
    rewardXp: 70,
  },
  {
    id: 'course-waste-sort',
    title: 'Сортировка: от причала до контейнера',
    icon: '♻️',
    category: 'Базовый',
    description: 'Разбираем фракции отходов и правильно заполняем карточку уборки.',
    lessons: [
      'Фракции: стекло, ПЭТ, металл',
      'Опасные находки на пляже',
      'Учёт и взвешивание: карточка уборки',
    ],
    min: 25,
    rewardPoints: 15,
    rewardXp: 25,
  },
  {
    id: 'course-first-aid',
    title: 'Первая помощь в экспедиции',
    icon: '🩺',
    category: 'Продвинутый',
    description: 'Аптечка смотрителя и действия, когда рядом нет связи и врача.',
    lessons: [
      'Аптечка смотрителя',
      'Солнечный удар и обезвоживание',
      'Порезы, уколы, ушибы',
      'Вызов помощи вдали от связи',
    ],
    min: 40,
    rewardPoints: 25,
    rewardXp: 45,
  },
  {
    id: 'course-water-safety',
    title: 'Безопасность у воды и на островах',
    icon: '⚓',
    category: 'Базовый',
    description: 'Как работать у кромки прилива и не навредить себе и товарищу.',
    lessons: [
      'Оценка погоды и волнения',
      'Правила работы у кромки прилива',
      'Спасение себя и товарища',
    ],
    min: 30,
    rewardPoints: 20,
    rewardXp: 35,
  },
  {
    id: 'course-photo-report',
    title: 'Фотофиксация и отчёт',
    icon: '📸',
    category: 'Базовый',
    description: 'Снимаем «до/после» так, чтобы кадр прошёл проверку куратора.',
    lessons: [
      'Точка съёмки до/после',
      'Заполнение карточки очага',
      'Публикация отчёта в кабинете',
    ],
    min: 20,
    rewardPoints: 15,
    rewardXp: 30,
  },
]

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id)
}