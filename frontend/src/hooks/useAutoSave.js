import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * useAutoSave — debounces any save function with robust support for object or positional parameters.
 */
export function useAutoSave(arg1, arg2 = 1800) {
  const saveFn = typeof arg1 === 'function' ? arg1 : arg1?.saveFn
  const delay  = typeof arg1 === 'object' && arg1?.delay ? arg1.delay : (typeof arg2 === 'number' ? arg2 : 1800)

  const [status, setStatus] = useState('idle') // 'idle' | 'saving' | 'saved' | 'error'
  const timer   = useRef(null)
  const pending = useRef(false)
  const lastArgs = useRef(null)

  const trigger = useCallback((...args) => {
    pending.current = true
    lastArgs.current = args
    setStatus('saving')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        if (saveFn) {
          await saveFn(...(lastArgs.current || []))
        }
        pending.current = false
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2000)
      } catch (err) {
        console.error('[AutoSave] Save error:', err)
        setStatus('error')
      }
    }, delay)
  }, [saveFn, delay])

  const flush = useCallback(async (...args) => {
    if (timer.current) clearTimeout(timer.current)
    const callArgs = args.length > 0 ? args : lastArgs.current
    if (saveFn && (pending.current || args.length > 0)) {
      setStatus('saving')
      try {
        await saveFn(...(callArgs || []))
        pending.current = false
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2000)
      } catch (err) {
        console.error('[AutoSave] Flush save error:', err)
        setStatus('error')
        throw err
      }
    }
  }, [saveFn])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  return {
    trigger,
    triggerChange: trigger,
    flush,
    flushSave: flush,
    status,
    isPending: () => pending.current
  }
}
