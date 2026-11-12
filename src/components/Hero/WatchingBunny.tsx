import { useEffect, useRef, useState } from 'react'
import s from './WatchingBunny.module.css'

/** One pixel of the bunny art, in the SVG's own units (bunny.svg is 186×181). */
const PX = 4.67219

/**
 * Top-left corner of each eye's 2×2 brown middle — where the pink highlight sits by default.
 * Eye 1 is the third eye on the forehead, eye 2 the right eye. The ✕ eye doesn't move.
 */
const EYES = [
  { x: 77.5583, y: 56.0669 },
  { x: 103.2548, y: 74.7551 },
]

/** Cursor this close (screen px) to the eyes on an axis counts as "straight ahead" on that axis. */
const DEAD_ZONE = 24

/** No pointer movement for this long → the bunny falls asleep. */
const SLEEP_AFTER = 15_000
/** How long the eyes stay shut in one blink. */
const BLINK_MS = 150
/** Random pause between blinks. */
const BLINK_EVERY: [number, number] = [3000, 6000]
/** How long the bunny stares wide-eyed after being woken up. */
const SCARED_MS = 700

/** 0 | 1 | 2 → highlight shifted by 0, ½ or 1 art pixel (5 / 10 px in the Figma master). */
type Step = 0 | 1 | 2

/**
 * awake  — bunny.svg + highlights that follow the cursor
 * blink  — "моргнувший" frame for a moment
 * sleep  — same closed-eye frame + a floating pixel Z
 * scared — "испугавшийся" frame right after waking up
 */
type Mode = 'awake' | 'blink' | 'sleep' | 'scared'

const toStep = (d: number): Step => (d < -DEAD_ZONE ? 0 : d > DEAD_ZONE ? 2 : 1)
const between = ([min, max]: [number, number]) => min + Math.random() * (max - min)

type Props = {
  className: string
}

/** The big info.exe bunny: eyes follow the cursor, it blinks, dozes off and gets startled. */
export default function WatchingBunny({ className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  // Figma default: highlight in the top-left of the eye.
  const [look, setLook] = useState<{ x: Step; y: Step }>({ x: 0, y: 0 })
  const [mode, setMode] = useState<Mode>('awake')
  const modeRef = useRef<Mode>('awake')

  useEffect(() => {
    const timers = new Set<number>()
    const later = (fn: () => void, ms: number) => {
      const t = window.setTimeout(() => {
        timers.delete(t)
        fn()
      }, ms)
      timers.add(t)
      return t
    }
    const go = (m: Mode) => {
      modeRef.current = m
      setMode(m)
    }

    // ---- blinking: a quick shut-open every few seconds, sometimes twice ----
    const blinkOnce = (then: () => void) => {
      if (modeRef.current !== 'awake') return then()
      go('blink')
      later(() => {
        if (modeRef.current === 'blink') go('awake')
        then()
      }, BLINK_MS)
    }
    const scheduleBlink = () => {
      later(() => {
        const double = Math.random() < 0.25
        blinkOnce(() => (double ? later(() => blinkOnce(scheduleBlink), 180) : scheduleBlink()))
      }, between(BLINK_EVERY))
    }
    scheduleBlink()

    // ---- sleeping: no pointer movement for SLEEP_AFTER ----
    let sleepTimer = 0
    const resetSleep = () => {
      if (sleepTimer) {
        window.clearTimeout(sleepTimer)
        timers.delete(sleepTimer)
      }
      sleepTimer = later(() => go('sleep'), SLEEP_AFTER)
    }
    resetSleep()

    // ---- following the cursor (and waking up) ----
    const onPointer = (e: PointerEvent) => {
      if (modeRef.current === 'sleep') {
        go('scared')
        later(() => {
          if (modeRef.current === 'scared') go('awake')
        }, SCARED_MS)
      }
      resetSleep()

      const el = ref.current
      if (!el) return
      // Midpoint between the two eyes, in screen coordinates.
      const r = el.getBoundingClientRect()
      const k = r.width / 186
      const cx = r.left + ((EYES[0].x + EYES[1].x) / 2 + PX) * k
      const cy = r.top + ((EYES[0].y + EYES[1].y) / 2 + PX) * k
      const next = { x: toStep(e.clientX - cx), y: toStep(e.clientY - cy) }
      setLook((prev) => (prev.x === next.x && prev.y === next.y ? prev : next))
    }

    window.addEventListener('pointermove', onPointer)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  const shift = `translate(${(look.x * PX) / 2}px, ${(look.y * PX) / 2}px)`
  const eyesShut = mode === 'blink' || mode === 'sleep'

  return (
    <div ref={ref} className={`${s.bunny} ${className}`} data-mode={mode}>
      {/* All three frames stay loaded and swap instantly — no flicker on the first blink. */}
      <img
        className={mode === 'awake' ? undefined : s.hidden}
        src="/assets/bunny.svg"
        alt="Pink pixel bunny with a third eye"
        width={186}
        height={181}
      />
      <img className={eyesShut ? undefined : s.hidden} src="/assets/bunny-blink.svg" alt="" width={186} height={181} />
      <img className={mode === 'scared' ? undefined : s.hidden} src="/assets/bunny-scared.svg" alt="" width={186} height={181} />

      {mode === 'awake' &&
        EYES.map((eye, i) => (
          <span
            key={i}
            className={s.highlight}
            style={{ left: eye.x, top: eye.y, width: PX, height: PX, transform: shift }}
            aria-hidden="true"
          />
        ))}

      {mode === 'sleep' && <img className={s.z} src="/assets/bunny-z.svg" alt="" width={18.689} height={23.361} />}
    </div>
  )
}
