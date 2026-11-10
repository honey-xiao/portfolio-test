# Portfolio — Alisa Hordon (Xiao)

UI/UX designer portfolio in a "creepy cute" retro-OS style. The site plan is in [PLAN.md](PLAN.md).

**Stack:** Vite + React + TypeScript, CSS Modules. Deploys to Vercel as a static site (framework preset: Vite).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```bash
npm run build
```

The output goes to `dist/`.

## Structure

- `src/components/Hero` — first screen (Figma frame "Desktop - 1", 1440×1024). It is laid out on a fixed 1440×1024 canvas that scales to the browser width.
- `src/components/BevelButton` — the pixel Windows-98 style button.
- `public/assets` — pixel art and window controls exported from Figma as SVG.
