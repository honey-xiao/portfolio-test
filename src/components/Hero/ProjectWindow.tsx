import type { ReactNode } from 'react'
import BevelButton from '../BevelButton/BevelButton.tsx'
import WindowControls from './WindowControls.tsx'
import s from './ProjectWindow.module.css'

type Props = {
  className: string
  height: number
  title: string
  controls: 'lorry' | 'folio' | 'vsl'
  path: string
  description: ReactNode
  viewHref?: string
}

/** Case-study card drawn as a retro OS window (Folio.app, VSL.app, LorryDesk.exe). */
export default function ProjectWindow({
  className,
  height,
  title,
  controls,
  path,
  description,
  viewHref = '#projects',
}: Props) {
  return (
    <article className={`${s.window} ${className}`} style={{ height }}>
      <div className={s.content}>
        <div className={s.top}>
          <div className={s.header}>
            <div className={s.titlebar}>
              <h2 className={s.title}>{title}</h2>
              <WindowControls variant={controls} size={20.588} gap={3.743} />
            </div>
            <p className={s.path}>{path}</p>
          </div>
          <div className={s.body}>
            <img src="/assets/computer.svg" alt="" width={47} height={53} />
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
