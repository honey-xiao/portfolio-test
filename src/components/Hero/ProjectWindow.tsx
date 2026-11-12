import type { ReactNode } from 'react'
import BevelButton from '../BevelButton/BevelButton.tsx'
import WindowControls from './WindowControls.tsx'
import s from './ProjectWindow.module.css'

type Props = {
  left: number
  top: number
  height: number
  zIndex: number
  title: string
  controls: 'lorry' | 'folio' | 'vsl'
  path: string
  description: ReactNode
  /** Pixel computer icon: Group 57 (web, 47×53) or Group 59 (mobile, 47×65) */
  icon: 'web' | 'mobile'
  viewHref?: string
  onClose: () => void
  onFocus: () => void
}

const ICONS = {
  web: { src: '/assets/computer.svg', width: 47, height: 53 },
  mobile: { src: '/assets/computer-mobile.svg', width: 47, height: 65 },
}

/** Case-study card drawn as a retro OS window (Folio.app, VSL.app, LorryDesk.exe). */
export default function ProjectWindow({
  left,
  top,
  height,
  zIndex,
  title,
  controls,
  path,
  description,
  icon,
  viewHref = '#projects',
  onClose,
  onFocus,
}: Props) {
  return (
    <article
      className={s.window}
      style={{ left, top, height, zIndex }}
      onMouseDown={onFocus}
      onFocus={onFocus}
      aria-label={title}
    >
      <div className={s.content}>
        <div className={s.top}>
          <div className={s.header}>
            <div className={s.titlebar}>
              <h2 className={s.title}>{title}</h2>
              <WindowControls
                variant={controls}
                size={20.588}
                gap={3.743}
                onClose={onClose}
                closeLabel={`Close ${title}`}
              />
            </div>
            <p className={s.path}>{path}</p>
          </div>
          <div className={s.body}>
            <img src={ICONS[icon].src} alt="" width={ICONS[icon].width} height={ICONS[icon].height} />
            <p className={s.description}>{description}</p>
          </div>
        </div>
        <div className={s.actions}>
          <BevelButton href={viewHref} width={112.299} height={37.433} bevel={0.936} fontSize={14.973}>
            View
          </BevelButton>
          <BevelButton href={viewHref} width={112.299} height={37.433} bevel={0.936} fontSize={14.973}>
            Wanna see
          </BevelButton>
        </div>
      </div>
    </article>
  )
}
