import type { CSSProperties } from 'react'
import s from './ZoomRect.module.css'

export type Rect = { x: number; y: number; w: number; h: number }

type Props = {
  from: Rect
  to: Rect
  /** Closing: the rectangle shrinks back into the folder. */
  reverse?: boolean
  onDone: () => void
}

/**
 * Windows 95/98-style "exploding rectangle": a window outline jumps from the
 * folder icon to the window's place in a few hard steps (no smooth easing),
 * then the real window appears.
 */
export default function ZoomRect({ from, to, reverse = false, onDone }: Props) {
  const style = {
    '--fx': `${from.x}px`,
    '--fy': `${from.y}px`,
    '--fw': `${from.w}px`,
    '--fh': `${from.h}px`,
    '--tx': `${to.x}px`,
    '--ty': `${to.y}px`,
    '--tw': `${to.w}px`,
    '--th': `${to.h}px`,
  } as CSSProperties

  return (
    <div
      className={`${s.rect} ${reverse ? s.reverse : ''}`}
      style={style}
      onAnimationEnd={onDone}
      aria-hidden="true"
    />
  )
}
