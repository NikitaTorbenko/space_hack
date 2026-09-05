import type { Directive } from 'vue'

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12 },
)

export const reveal: Directive<HTMLElement, number | string | undefined> = {
  mounted(el, binding) {
    el.classList.add('reveal')
    const value = binding.value
    if (typeof value === 'number') el.style.transitionDelay = `${value}ms`
    else if (typeof value === 'string') el.style.transitionDelay = value
    observer.observe(el)
  },
  unmounted(el) {
    observer.unobserve(el)
  },
}