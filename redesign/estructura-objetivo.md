# Estructura Objetivo (v2)

## Principios

- Organización por dominio y casos de uso.
- Separación entre UI, estado, servicios y entidades.
- Dependencias dirigidas hacia `shared`.
- Migración incremental compatible con la app actual.

## Árbol propuesto

```text
src-v2/
  app/
    providers/
    router/
  features/
    catalogo/
      pages/
      components/
      services/
      hooks/
    admin/
      pages/
      components/
      services/
      hooks/
    blog/
      pages/
      components/
      services/
      hooks/
    auth/
      pages/
      components/
      services/
      hooks/
  entities/
    animal/
    product/
    user/
    order/
    blog/
  processes/
    checkout/
    auth/
    inventory/
  shared/
    ui/
    layout/
    api/
    lib/
    config/
    utils/
```

## Convenciones recomendadas

- `features/*/pages`: composición de pantallas.
- `features/*/services`: consultas/mutaciones externas.
- `entities/*`: tipos, mapeadores y reglas de negocio.
- `processes/*`: flujos que cruzan módulos.
- `shared/api`: clientes HTTP/Supabase y utilidades de red.

## Resultado esperado

- Menor acoplamiento entre módulos.
- Código más fácil de testear.
- Capacidad de migrar por lotes sin big-bang rewrite.
