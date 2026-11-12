import type { ReactNode } from 'react'
import s from './SpeechBubble.module.css'

/** One art pixel of the Figma speech bubble (info.exe-local units). */
const P = 8.15349
const LINE = '#E46C7E'
const FILL = '#FDF6F9'

type Props = {
  /** Body size in art pixels (the tail hangs 3 pixels below). */
  cols: number
  rows: number
  /** Column where the tail starts, counted from the left. */
  tail: number
  className?: string
  children: ReactNode
}

/**
 * The info.exe speech bubble rebuilt at any size: same pixel size, stepped corners and
 * down-right tail as speech-bubble.svg, with real text inside instead of outlined glyphs.
 */
export default function SpeechBubble({ cols: W, rows: H, tail: t, className, children }: Props) {
  const px: [number, number, number, string][] = [] // x, y, width (in pixels), colour
  const row = (y: number, x0: number, x1: number, c: string) => x1 >= x0 && px.push([x0, y, x1 - x0 + 1, c])

  row(0, 2, W - 3, LINE)
  row(1, 1, 1, LINE), row(1, 2, W - 3, FILL), row(1, W - 2, W - 2, LINE)
  for (let y = 2; y <= H - 3; y++) row(y, 0, 0, LINE), row(y, 1, W - 2, FILL), row(y, W - 1, W - 1, LINE)
  row(H - 2, 1, 1, LINE), row(H - 2, 2, W - 3, FILL), row(H - 2, W - 2, W - 2, LINE)
  // bottom edge with the tail opening in it
  row(H - 1, 2, t - 1, LINE), row(H - 1, t, t + 1, FILL), row(H - 1, t + 2, W - 3, LINE)
  // tail, leaning down-right towards the bunny
  row(H, t - 1, t - 1, LINE), row(H, t, t + 1, FILL), row(H, t + 2, t + 2, LINE)
  row(H + 1, t, t, LINE), row(H + 1, t + 1, t + 1, FILL), row(H + 1, t + 2, t + 2, LINE)
  row(H + 2, t + 1, t + 2, LINE)

  return (
    <div className={`${s.bubble} ${className ?? ''}`} style={{ width: W * P, height: (H + 3) * P }}>
      <svg
        className={s.art}
        viewBox={`0 0 ${W} ${H + 3}`}
        width={W * P}
        height={(H + 3) * P}
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        {px.map(([x, y, w, c]) => (
          <rect key={`${x}-${y}-${c}`} x={x} y={y} width={w} height={1} fill={c} />
        ))}
      </svg>
      <p className={s.text} style={{ left: 3 * P, top: 2 * P, right: 3 * P, bottom: 3 * P + 2 * P }}>
        {children}
      </p>
    </div>
  )
}
