import { RefObject, useEffect, useLayoutEffect, useRef } from 'react'

interface ScrollPosition {
  x: number;
  y: number;
}

interface ScrollEffect {
  prevPos: ScrollPosition;
  currPos: ScrollPosition;
}

interface ScrollOptions {
  element?: RefObject<HTMLElement>;
  useWindow?: boolean;
}

function getScrollPosition({ element, useWindow }: ScrollOptions): ScrollPosition {
  if (typeof window === 'undefined') return { x: 0, y: 0 }

  const target = element ? element.current : document.body

  if (!target) {
    return { x: 0, y: 0 }
  }

  const position = target.getBoundingClientRect()

  return useWindow
    ? { x: window.scrollX, y: window.scrollY }
    : { x: position.left, y: position.top }
}

export function useScrollPosition(
  effect: (effect: ScrollEffect) => void,
  deps?: any[],
  element?: RefObject<HTMLElement>,
  useWindow?: boolean,
  wait?: number
) {
  const position = useRef(getScrollPosition({ useWindow }))

  let throttleTimeout: NodeJS.Timeout | null = null

  const callBack = () => {
    const currPos = getScrollPosition({ element, useWindow })
    effect({ prevPos: position.current, currPos })
    position.current = currPos
    throttleTimeout = null
  }

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (wait) {
        if (throttleTimeout === null) {
          throttleTimeout = setTimeout(callBack, wait)
        }
      } else {
        callBack()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, deps)
}
