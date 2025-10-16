# Lok (Vite + React)

A minimal, working scaffold mirroring the pages and imports from the original logs.

## Run
- npm install
- npm run dev
- Optional: npm run dev -- --host (expose to LAN)

## Notes
- Alias "@" points to ./src (vite.config.js + jsconfig.json).
- UI components under src/components/ui replace external UI libs to keep imports working without extra setup.
- date-fns is installed and used wherever format() was imported.
