import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const update = (event?: MediaQueryListEvent) => {
      if (event?.matches !== undefined) {
        setIsMobile(event.matches)
      } else {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
    }

    update()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update)
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(update)
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', update)
      } else if (typeof mediaQuery.removeListener === 'function') {
        mediaQuery.removeListener(update)
      }
    }
  }, [])

  return isMobile
}
