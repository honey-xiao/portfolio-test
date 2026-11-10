type Variant = 'info' | 'lorry' | 'folio' | 'vsl' | 'pos'

type Props = {
  variant: Variant
  size: number
  gap: number
}

/** Minimise / maximise / close pixel buttons from the Figma titlebars (decorative). */
export default function WindowControls({ variant, size, gap }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, flexShrink: 0 }} aria-hidden="true">
      {(['min', 'max', 'close'] as const).map((kind) => (
        <img
          key={kind}
          src={`/assets/ctrl-${variant}-${kind}.svg`}
          alt=""
          width={size}
          height={size}
        />
      ))}
    </div>
  )
}
