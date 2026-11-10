import { useEffect, useRef, useState, type CSSProperties } from 'react'
import BevelButton from '../BevelButton/BevelButton.tsx'
import WindowControls from './WindowControls.tsx'
import ProjectWindow from './ProjectWindow.tsx'
import s from './Hero.module.css'

/** Size of the Figma frame "Desktop - 1" — the whole hero is laid out on this canvas. */
const STAGE_W = 1440
const STAGE_H = 1024

const EMAIL = 'alisa.hordon@gmail.com'

const ERROR_STACK = [
  { left: 1232, top: 425 },
  { left: 1217, top: 452 },
  { left: 1202, top: 479 },
  { left: 1187, top: 506 },
  { left: 1172, top: 533 },
  { left: 1157, top: 560 },
]

/** Scales the fixed 1440×1024 desktop to the browser width. */
function useStageScale() {
  const ref = useRef<HTMLDivElement>(null)
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

  return (
    <section
      ref={ref}
      className={s.viewport}
      style={{ height: STAGE_H * scale } as CSSProperties}
      aria-label="Alisa Hordon (Xiao) — UI/UX designer portfolio"
    >
      <div
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

          <nav className={s.folders} aria-label="Sections">
            <a className={s.folder} href="#about">
              <img src="/assets/folder-about.svg" alt="" width={71} height={56} />
              <span>About me</span>
            </a>
            <a className={s.folder} href="#projects">
              <img src="/assets/folder-projects.svg" alt="" width={71} height={56} />
              <span>My projects</span>
            </a>
            <a className={s.folder} href="#contacts">
              <img src="/assets/folder-contacts.svg" alt="" width={71} height={56} />
              <span>Contacts</span>
            </a>
          </nav>

          <img className={s.cursor} src="/assets/cursor.svg" alt="" />
          <img
            className={s.bubble}
            src="/assets/speech-bubble.svg"
            alt="Hello! I am Alisa or Xiao. There you can find all information!"
          />
          <img className={s.bunny} src="/assets/bunny.svg" alt="Pink pixel bunny with a third eye" />

          <div className={s.infoButtons}>
            <BevelButton href="#about" width={146.067} height={48.689} bevel={1.217} fontSize={20}>
              About me
            </BevelButton>
            <BevelButton href="#projects" width={146.067} height={48.689} bevel={1.217} fontSize={20}>
              My projects
            </BevelButton>
            <BevelButton href="#contacts" width={146.067} height={48.689} bevel={1.217} fontSize={20}>
              Contacts
            </BevelButton>
          </div>
        </div>

        {/* ---------- project windows ---------- */}
        <ProjectWindow
          className={s.lorry}
          height={224.599}
          title="LorryDesk.exe"
          controls="lorry"
          path="web > logistics platform"
          description={<>Web product for a logistics business. Client project, in progress.</>}
        />
        <ProjectWindow
          className={s.folio}
          height={248.93}
          title="Folio.app"
          controls="folio"
          path="mobile > book discussion app"
          description={
            <>
              An app for discussing books with other readers.
              <br />
              Solo project — research to final UI.
            </>
          }
        />
        <ProjectWindow
          className={s.vsl}
          height={273.262}
          title="VSL.app"
          controls="vsl"
          path="mobile > audiobook app for a publisher"
          description={
            <>
              Audiobook app for Old Lion Publishing House publishing house, built around their
              loyalty program. Partnership project.
            </>
          }
        />

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

        {/* ---------- Positioning ---------- */}
        <div className={`${s.window} ${s.positioning}`}>
          <div className={s.posTitlebar}>
            <p className={s.posTitle}>Positioning</p>
            <WindowControls variant="pos" size={22} gap={4} />
          </div>
          <div className={s.posBody}>
            <p>
              I’m a UI/UX designer for product teams — I design mobile apps and B2B web products,
              with a focus on clear logic and clean developer handoff.
            </p>
          </div>
          <div className={s.posOk}>
            <BevelButton href="#projects" width={120} height={40}>
              OK
            </BevelButton>
          </div>
        </div>

        {/* ---------- stacked Error windows ---------- */}
        {ERROR_STACK.map((pos, i) => (
          <div
            key={i}
            className={s.error}
            style={{ left: pos.left, top: pos.top }}
            aria-hidden={i < ERROR_STACK.length - 1 ? true : undefined}
          >
            <div className={s.errorContent}>
              <div className={s.errorTop}>
                <div className={s.errorTitlebar}>
                  <p>Error</p>
                  <img src="/assets/ctrl-pos-close.svg" alt="" width={22} height={22} />
                </div>
                <p className={s.errorText}>Fatal error: designer not hired yet.</p>
              </div>
              <BevelButton href={`mailto:${EMAIL}`} width={120} height={40}>
                Fix it!
              </BevelButton>
            </div>
          </div>
        ))}

        {/* ---------- bunny with a mop ---------- */}
        <img className={s.bunnySmile} src="/assets/bunny-smile.svg" alt="" />
        <img className={s.mop} src="/assets/mop.svg" alt="" />
      </div>
    </section>
  )
}
