import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import BevelButton from '../BevelButton/BevelButton.tsx'
import WindowControls from './WindowControls.tsx'
import ProjectWindow from './ProjectWindow.tsx'
import ZoomRect, { type Rect } from './ZoomRect.tsx'
import WatchingBunny from './WatchingBunny.tsx'
import SpeechBubble from './SpeechBubble.tsx'
import s from './Hero.module.css'

/** Size of the Figma frame "Desktop - 1" — the whole hero is laid out on this canvas. */
const STAGE_W = 1440
const STAGE_H = 1024

const EMAIL = 'alisa.hordon@gmail.com'

/**
 * Error windows under info.exe, back to front. The cascade runs left → right: each one sits
 * 15px right and 27px lower than the one behind it. The first is the one that can't be closed.
 */
const ERROR_STACK = Array.from({ length: 6 }, (_, i) => ({ left: 28 + i * 15, top: 650 + i * 27 }))

/** How long the laughing bunny stays: pops up, laughs, hides again (matches .laugh in the CSS). */
const LAUGH_MS = 2200

type ProjectId ='lorry' | 'folio' | 'vsl'

type Project = {
  id: ProjectId
  title: string
  path: string
  icon: 'web' | 'mobile'
  height: number
  /** Where the window lands — a classic cascade under cmd.exe (it ends at y 268), the last one opened on top. */
  left: number
  top: number
  description: ReactNode
}

/** Opening order: VSL opens last so it ends up in front. */
const PROJECTS: Project[] = [
  {
    id: 'lorry',
    title: 'LorryDesk.exe',
    path: 'web > logistics platform',
    icon: 'web',
    height: 224.599,
    left: 880,
    top: 290,
    description: <>Web product for a logistics business. Client project, in progress.</>,
  },
  {
    id: 'folio',
    title: 'Folio.app',
    path: 'mobile > book discussion app',
    icon: 'mobile',
    height: 248.93,
    left: 940,
    top: 360,
    description: (
      <>
        An app for discussing books with other readers.
        <br />
        Solo project — research to final UI.
      </>
    ),
  },
  {
    id: 'vsl',
    title: 'VSL.app',
    path: 'mobile > audiobook app for a publisher',
    icon: 'mobile',
    height: 273.262,
    left: 1000,
    top: 430,
    description: (
      <>
        Audiobook app for Old Lion Publishing House publishing house, built around their loyalty
        program. Partnership project.
      </>
    ),
  },
]

/** Folders in info.exe, top to bottom — each one opens its own project window. */
const FOLDERS: { id: ProjectId; label: string; icon: string }[] = [
  { id: 'lorry', label: 'LorryDesk.exe', icon: '/assets/folder-about.svg' },
  { id: 'folio', label: 'Folio.app', icon: '/assets/folder-projects.svg' },
  { id: 'vsl', label: 'VSL.app', icon: '/assets/folder-contacts.svg' },
]

const PROJECT_W = 350
/** Delay between windows popping up one after another. */
const CASCADE_DELAY = 140

type Phase = 'closed' | 'opening' | 'open' | 'closing'

const ALL_CLOSED: Record<ProjectId, Phase> = { lorry: 'closed', folio: 'closed', vsl: 'closed' }

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Scales the fixed 1440×1024 desktop to the browser width. */
function useStageScale() {
  const ref = useRef<HTMLElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setScale(el.clientWidth / STAGE_W)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, scale }
}

export default function Hero() {
  const { ref, scale } = useStageScale()
  const stageRef = useRef<HTMLDivElement>(null)

  const [phase, setPhase] = useState<Record<ProjectId, Phase>>(ALL_CLOSED)
  const [zIndex, setZIndex] = useState<Record<ProjectId, number>>({ lorry: 10, folio: 11, vsl: 12 })
  const zTop = useRef(12)
  const folderIcons = useRef<Partial<Record<ProjectId, HTMLImageElement | null>>>({})
  const folderRects = useRef<Record<ProjectId, Rect>>({
    lorry: { x: 0, y: 0, w: 0, h: 0 },
    folio: { x: 0, y: 0, w: 0, h: 0 },
    vsl: { x: 0, y: 0, w: 0, h: 0 },
  })
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const setProjectPhase = useCallback((id: ProjectId, next: Phase) => {
    setPhase((prev) => ({ ...prev, [id]: next }))
  }, [])

  const bringToFront = useCallback((id: ProjectId) => {
    zTop.current += 1
    const z = zTop.current
    setZIndex((prev) => ({ ...prev, [id]: z }))
  }, [])

  /** A project's folder icon, in stage (Figma) coordinates — where its window flies out of. */
  const measureFolder = (id: ProjectId) => {
    const icon = folderIcons.current[id]
    const stage = stageRef.current
    if (!icon || !stage) return
    const r = icon.getBoundingClientRect()
    const st = stage.getBoundingClientRect()
    folderRects.current[id] = {
      x: (r.left - st.left) / scale,
      y: (r.top - st.top) / scale,
      w: r.width / scale,
      h: r.height / scale,
    }
  }

  /** Folder click: open that project's window (or bring it to the front if it's already open). */
  const openProject = (id: ProjectId) => {
    measureFolder(id)
    setPhase((prev) =>
      prev[id] === 'closed' ? { ...prev, [id]: prefersReducedMotion() ? 'open' : 'opening' } : prev,
    )
    bringToFront(id)
  }

  /** "My projects" button: every project window, one after another. */
  const openAllProjects = () => {
    timers.current.forEach(clearTimeout)
    const instant = prefersReducedMotion()
    PROJECTS.forEach((p, i) => {
      timers.current.push(window.setTimeout(() => openProject(p.id), instant ? 0 : i * CASCADE_DELAY))
    })
  }

  // ---- Error windows: the front one closes; the last one can't — the bunny laughs instead ----
  const [errorsLeft, setErrorsLeft] = useState(ERROR_STACK.length)
  const [laughing, setLaughing] = useState(false)
  const laughTimer = useRef(0)
  useEffect(() => () => clearTimeout(laughTimer.current), [])

  const closeError = () => {
    if (errorsLeft > 1) {
      setErrorsLeft((n) => n - 1)
      return
    }
    if (laughing) return
    setLaughing(true)
    laughTimer.current = window.setTimeout(() => setLaughing(false), LAUGH_MS)
  }

  const closeProject = (id: ProjectId) => {
    measureFolder(id)
    setProjectPhase(id, prefersReducedMotion() ? 'closed' : 'closing')
  }

  return (
    <section
      ref={ref}
      className={s.viewport}
      style={{ height: STAGE_H * scale } as CSSProperties}
      aria-label="Alisa Hordon (Xiao) — UI/UX designer portfolio"
    >
      <div
        ref={stageRef}
        className={s.stage}
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
      >
        {/* ---------- info.exe ---------- */}
        <div className={`${s.window} ${s.info}`}>
          <div className={s.infoTitlebar}>
            <p className={s.infoTitle}>info.exe</p>
            <WindowControls variant="info" size={26.779} gap={4.869} />
          </div>

          <div className={s.infoScreen} />
          <img className={s.infoDecor} src="/assets/info-bg-decor.svg" alt="" />

          <nav className={s.folders} aria-label="Projects">
            {FOLDERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={s.folder}
                onClick={() => openProject(f.id)}
                aria-expanded={phase[f.id] !== 'closed'}
              >
                <img
                  ref={(el) => {
                    folderIcons.current[f.id] = el
                  }}
                  src={f.icon}
                  alt=""
                  width={71}
                  height={56}
                />
                <span>{f.label}</span>
              </button>
            ))}
          </nav>

          {/* The bunny introduces Alisa — this is also the positioning statement. */}
          <SpeechBubble className={s.bubble} cols={39} rows={12} tail={34}>
            Hello! I am Alisa or Xiao. I’m a UI/UX designer for product teams — I design mobile apps
            and B2B web products, with a focus on clear logic and clean developer handoff.
          </SpeechBubble>
          <WatchingBunny className={s.bunny} />

          <div className={s.infoButtons}>
            <BevelButton href="#about" width={146.067} height={48.689} bevel={1.217} fontSize={20}>
              About me
            </BevelButton>
            <BevelButton onClick={openAllProjects} width={146.067} height={48.689} bevel={1.217} fontSize={20}>
              My projects
            </BevelButton>
            <BevelButton href="#contacts" width={146.067} height={48.689} bevel={1.217} fontSize={20}>
              Contacts
            </BevelButton>
          </div>
        </div>

        {/* ---------- cmd.exe ---------- */}
        <div className={s.cmd}>
          <div className={s.cmdHeader}>
            <div className={s.cmdTitlebar}>
              <div className={s.cmdTitle}>
                <p>cmd.exe</p>
              </div>
              <div className={s.cmdControls} aria-hidden="true">
                <img src="/assets/ctrl-cmd-min.svg" alt="" width={27.708} height={27.708} />
                <img src="/assets/ctrl-cmd-max.svg" alt="" width={27.708} height={27.708} />
                <span className={s.cmdClose}>
                  <img src="/assets/ctrl-cmd-close.svg" alt="" />
                </span>
              </div>
            </div>
            <div className={s.cmdLines}>
              <p>{'C:\\Alisa> hire_me'}</p>
              <p>{'> looking for: full-time'}</p>
              <p className={s.cmdStatus}>
                {'> status: available'}
                <img src="/assets/status-dot.svg" alt="" width={7.292} height={7.292} />
              </p>
              <p>
                {'> email: '}
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </p>
              <p>
                {'> '}
                <span className={s.caret}>_</span>
              </p>
            </div>
          </div>
          <a className={s.cmdSend} href={`mailto:${EMAIL}`}>
            [ Send message ]
          </a>
        </div>

        {/* ---------- big title + sparkles ---------- */}
        <img className={s.sparkleBig} src="/assets/sparkle-big.svg" alt="" />
        <img className={s.sparkleTop} src="/assets/sparkle-top.svg" alt="" />
        <img className={s.sparkleBottom} src="/assets/sparkle-bottom.svg" alt="" />
        <h1 className={s.title}>Portfolio</h1>
        <p className={s.byline}>by Alisa Hordon (Xiao)</p>
        <p className={s.role}>UI/UX Designer</p>


        {/* ---------- laughing bunny: peeks out from behind the last Error window ---------- */}
        {laughing && (
          <div
            className={s.laugh}
            style={{ left: ERROR_STACK[0].left + 20, top: ERROR_STACK[0].top - 106 }}
            aria-hidden="true"
          >
            <img src="/assets/bunny-laugh.svg" alt="" width={186} height={181.77} />
          </div>
        )}

        {/* ---------- stacked Error windows: close them one by one, except the last ---------- */}
        {ERROR_STACK.slice(0, errorsLeft).map((pos, i) => (
          <div
            key={i}
            className={s.error}
            style={{ left: pos.left, top: pos.top }}
            aria-hidden={i < errorsLeft - 1 ? true : undefined}
          >
            <div className={s.errorContent}>
              <div className={s.errorTop}>
                <div className={s.errorTitlebar}>
                  <p>Error</p>
                  <button type="button" className={s.errorClose} onClick={closeError} aria-label="Close error">
                    <img src="/assets/ctrl-pos-close.svg" alt="" width={22} height={22} />
                  </button>
                </div>
                <p className={s.errorText}>Fatal error: designer not hired yet.</p>
              </div>
              <BevelButton href={`mailto:${EMAIL}`} width={120} height={40}>
                Fix it!
              </BevelButton>
            </div>
          </div>
        ))}

        {/* ---------- project windows (open from the "My projects" folder) ---------- */}
        {PROJECTS.map((p) => {
          const target: Rect = { x: p.left, y: p.top, w: PROJECT_W, h: p.height }
          const ph = phase[p.id]

          if (ph === 'opening' || ph === 'closing') {
            return (
              <ZoomRect
                key={`${p.id}-${ph}`}
                from={folderRects.current[p.id]}
                to={target}
                reverse={ph === 'closing'}
                onDone={() => setProjectPhase(p.id, ph === 'opening' ? 'open' : 'closed')}
              />
            )
          }
          if (ph !== 'open') return null

          return (
            <ProjectWindow
              key={p.id}
              left={p.left}
              top={p.top}
              height={p.height}
              zIndex={zIndex[p.id]}
              title={p.title}
              controls={p.id}
              path={p.path}
              icon={p.icon}
              description={p.description}
              onClose={() => closeProject(p.id)}
              onFocus={() => bringToFront(p.id)}
            />
          )
        })}
      </div>
    </section>
  )
}
