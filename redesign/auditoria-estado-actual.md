# Auditoría del Estado Actual

Fecha de revisión: 2026-04-30

## Estado técnico verificado

- Stack: `Vite 7 + React 18 + Tailwind + Supabase`.
- Instalación: OK (`npm install`).
- Lint: OK (`npm run lint`).
- Build: OK (`npm run build`).
- Bundle principal: `~963.53 kB` (JS antes de gzip).
- Seguridad npm: `7 vulnerabilidades` reportadas (`3 moderate`, `4 high`).

## Hallazgos de estructura

- Punto de entrada muy centralizado en `src/App.jsx` con rutas públicas, privadas y admin mezcladas.
- Alta cantidad de páginas/componentes con responsabilidad múltiple.
- Módulo admin con archivos grandes (`AdminProducts.jsx`, `AdminVientres.jsx`, `AdminReproductores.jsx`).
- Cliente Supabase actual con URL/anon key hardcoded en `src/lib/customSupabaseClient.js`.
- No existe `.gitignore` en esta exportación del proyecto.

## Métricas rápidas

- Total aproximado de líneas JS/JSX en `src/`: `19,283`.
- Importaciones con alias `@/` en páginas/componentes/app: `334`.
- Carpeta `src/components/ui` extensa y útil como base reutilizable para nueva capa `shared/ui`.

## Riesgos si no se rediseña

- Dificultad creciente para mantenimiento y onboarding.
- Mayor probabilidad de regresiones al tocar pantallas grandes.
- Acoplamiento entre UI, acceso a datos y lógica de negocio.
- Complejidad alta para escalar módulos admin y flujos de checkout.
