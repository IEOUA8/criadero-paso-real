-- =====================================================
-- REPAIR CATEGORIES (PRODUCTION)
-- Criadero Paso Real
-- =====================================================
-- Este script:
-- 1) Crea public.categories si no existe
-- 2) Vincula products/blog_posts con categoria_id
-- 3) Configura RLS + políticas
-- 4) Crea categorías base solicitadas: reproductores, vientres, burros
-- 5) Refresca schema cache de PostgREST
-- =====================================================

BEGIN;

-- Extensión para gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Tabla categories
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  slug text NOT NULL UNIQUE,
  tipo text NOT NULL CHECK (tipo IN ('producto', 'blog')),
  descripcion text,
  color text DEFAULT '#C8A94B',
  orden integer DEFAULT 0,
  activa boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS categories_nombre_tipo_unique
  ON public.categories (lower(nombre), tipo);

CREATE INDEX IF NOT EXISTS categories_tipo_activa_idx
  ON public.categories (tipo, activa, orden);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_categories_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.set_categories_updated_at();

-- 2) Vinculación con tablas existentes
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS categoria_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS categoria_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;

-- 3) Helper para rol admin (si no existe)
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles up
    WHERE up.id = uid
      AND lower(coalesce(up.rol, '')) = 'admin'
  );
$$;

-- 4) RLS y políticas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS categories_select_public ON public.categories;
CREATE POLICY categories_select_public
ON public.categories
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS categories_insert_admin_only ON public.categories;
CREATE POLICY categories_insert_admin_only
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS categories_update_admin_only ON public.categories;
CREATE POLICY categories_update_admin_only
ON public.categories
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS categories_delete_admin_only ON public.categories;
CREATE POLICY categories_delete_admin_only
ON public.categories
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 5) Categorías base solicitadas (producto)
INSERT INTO public.categories (nombre, slug, tipo, descripcion, orden, activa)
SELECT 'Reproductores', 'reproductores', 'producto', 'Línea de reproductores del criadero', 1, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = 'reproductores' AND tipo = 'producto'
);

INSERT INTO public.categories (nombre, slug, tipo, descripcion, orden, activa)
SELECT 'Vientres', 'vientres', 'producto', 'Línea de vientres del criadero', 2, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = 'vientres' AND tipo = 'producto'
);

INSERT INTO public.categories (nombre, slug, tipo, descripcion, orden, activa)
SELECT 'Burros', 'burros', 'producto', 'Animales disponibles para venta', 3, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = 'burros' AND tipo = 'producto'
);

COMMIT;

-- Refresca caché de PostgREST para evitar PGRST205 inmediato
NOTIFY pgrst, 'reload schema';

-- Verificación rápida:
-- SELECT id, nombre, slug, tipo, activa, orden
-- FROM public.categories
-- ORDER BY tipo, orden, nombre;
