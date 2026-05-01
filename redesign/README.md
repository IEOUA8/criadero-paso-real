# Entorno de Rediseño - Criadero Paso Real

Este espacio prepara una migración **incremental** de la plataforma sin romper el sitio actual.

## Objetivo

- Mantener `src/` estable (producción actual).
- Construir una nueva arquitectura en `src-v2/` por capas y dominios.
- Migrar pantalla por pantalla de forma controlada.

## Documentos

- `redesign/auditoria-estado-actual.md`
- `redesign/estructura-objetivo.md`
- `redesign/plan-migracion.md`

## Estructura nueva

- `src-v2/app`: arranque de app, router y providers.
- `src-v2/features`: módulos funcionales (catálogo, admin, blog, auth).
- `src-v2/entities`: modelos y lógica de dominio.
- `src-v2/processes`: flujos de negocio transversales.
- `src-v2/shared`: utilidades, cliente API, UI base y configuración.

## Regla de trabajo

Toda mejora estructural nueva debe empezar en `src-v2/`.
