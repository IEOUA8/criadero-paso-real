# Flujo recomendado `dev` -> `main`

## Objetivo
- Trabajar en `dev` para cambios diarios.
- Publicar en producción solo cuando los cambios pasan a `main`.
- Hostinger despliega automáticamente desde `main`.

## Flujo diario
1. Cambiar a `dev`:
   - `git checkout dev`
2. Actualizar `dev`:
   - `git pull origin dev`
3. Hacer cambios, probar local:
   - `npm run dev`
   - `npm run lint`
   - `npm run build`
4. Subir cambios:
   - `git add .`
   - `git commit -m "feat: ..."`
   - `git push origin dev`

## Publicar a producción
1. Crear Pull Request de `dev` hacia `main` en GitHub.
2. Verificar que CI esté en verde.
3. Hacer merge del PR.
4. Hostinger detecta el cambio en `main` y vuelve a desplegar.

## Reglas recomendadas en GitHub
- Activar protección de rama en `main`:
  - Requerir Pull Request.
  - Requerir estado exitoso de checks (CI).
  - Bloquear pushes directos a `main`.

## Notas
- El workflow `.github/workflows/deploy-hostinger.yml` quedó manual (`workflow_dispatch`) para evitar doble despliegue si ya usas integración GitHub->Hostinger.
