import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // Always ensure we start at the top when navigating to a new route
    // This avoids cases where the browser restores a previous scroll position
    // (or jumps to a fragment) and leaves the page scrolled to the bottom.
    try {
      window.scrollTo({ top: 0, left: 0 })
    } catch (e) {
      // ignore
    }
  }, [pathname, hash])

  return null
}
