import type { CSSProperties, ReactNode } from 'react'
import styles from './BevelButton.module.css'

type Props = {
  children: ReactNode
  href?: string
  onClick?: () => void
  /** Outer size in px, as in the Figma frame */
  width: number
  height: number
  /** Bevel line thickness in px (scales with the window) */
  bevel?: number
  fontSize?: number
}

/** Pixel "Windows 98" button: light top-left edge, dark bottom-right edge. */
export default function BevelButton({
  children,
  href,
  onClick,
  width,
  height,
  bevel = 1,
  fontSize = 16,
}: Props) {
  const style = {
    '--w': `${width}px`,
    '--h': `${height}px`,
    '--b': `${bevel}px`,
    '--fs': `${fontSize}px`,
  } as CSSProperties

  if (href) {
    return (
      <a className={styles.button} style={style} href={href}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={styles.button} style={style} onClick={onClick}>
      {children}
    </button>
  )
}
