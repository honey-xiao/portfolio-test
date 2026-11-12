type Variant = 'info' | 'lorry' | 'folio' | 'vsl' | 'pos'

type Props = {
  variant: Variant
  size: number
  gap: number
  /** When set, the × becomes a real button that closes the window. */
  onClose?: () => void
  closeLabel?: string
}

const buttonReset = {
  display: 'block',
  padding: 0,
  border: 0,
  background: 'none',
} as const

/** Minimise / maximise / close pixel buttons from the Figma titlebars. */
export default function WindowControls({ variant, size, gap, onClose, closeLabel = 'Close' }: Props) {
  const img = (kind: 'min' | 'max' | 'close') => (
    <img src={`/assets/ctrl-${variant}-${kind}.svg`} alt="" width={size} height={size} />
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, flexShrink: 0 }}>
      <span aria-hidden="true">{img('min')}</span>
      <span aria-hidden="true">{img('max')}</span>
      {onClose ? (
        <button type="button" style={buttonReset} onClick={onClose} aria-label={closeLabel}>
          {img('close')}
        </button>
      ) : (
        <span aria-hidden="true">{img('close')}</span>
      )}
    </div>
  )
}
