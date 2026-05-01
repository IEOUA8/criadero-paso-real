# Plan de Migración Incremental

## Fase 0 - Base de trabajo (completada)

- Crear espacio `src-v2/`.
- Definir arquitectura objetivo.
- Dejar entorno de variables y exclusiones básicas.

## Fase 1 - Infraestructura v2

- Implementar `app/providers` y `app/router` en v2.
- Mover cliente de Supabase a `shared/api` basado en `import.meta.env`.
- Extraer utilidades genéricas hacia `shared/lib` y `shared/utils`.

## Fase 2 - Migración por dominios

- Migrar `auth` (login/signup/account).
- Migrar `catalogo` (home, venta, detalles, reproductores, vientres).
- Migrar `blog`.
- Migrar `admin` en subfases (dashboard, inventario, pedidos, blog).

## Fase 3 - Hardening

- Reducir tamaño de bundle con code-splitting por rutas.
- Añadir tests de humo por flujo crítico.
- Cerrar brechas de seguridad y auditoría npm.

## Criterio de avance

- No se migra una página sin:
- lint en verde
- build en verde
- validación manual de navegación y sesión
