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

/** 0 | 1 | 2 → highlight shifted by 0, ½ or 1 art pixel (5 / 10 px in the Figma master). */
type Step = 0 | 1 | 2

const toStep = (d: number): Step => (d < -DEAD_ZONE ? 0 : d > DEAD_ZONE ? 2 : 1)

type Props = {
  className: string
}

/** The big info.exe bunny: both open eyes' highlights follow the cursor in half-pixel jumps. */
export default function WatchingBunny({ className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  // Figma default: highlight in the top-left of the eye.
  const [look, setLook] = useState<{ x: Step; y: Step }>({ x: 0, y: 0 })

  useEffect(() => {
    // Cheap enough to run on every move; React re-renders only when the step changes.
    const onPointer = (e: PointerEvent) => {
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
    }
  }, [])

  const shift = `translate(${(look.x * PX) / 2}px, ${(look.y * PX) / 2}px)`

  return (
    <div ref={ref} className={`${s.bunny} ${className}`}>
      <img src="/assets/bunny.svg" alt="Pink pixel bunny with a third eye" width={186} height={181} />
      {EYES.map((eye, i) => (
        <span
          key={i}
          className={s.highlight}
          style={{ left: eye.x, top: eye.y, width: PX, height: PX, transform: shift }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}
