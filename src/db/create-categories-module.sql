-- =====================================================
-- CATEGORIES MODULE MIGRATION
-- Criadero Paso Real
-- =====================================================
-- Crea la tabla categories y la vincula con products y blog_posts
-- para habilitar CRUD + filtros por categoría en Admin y Web.

BEGIN;

-- 1) Tabla de categorías
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

-- 2) Trigger para updated_at
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

-- 3) Vinculación con productos/blog
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS categoria_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS categoria_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;

-- 4) Seeds base (solo si no existen)
INSERT INTO public.categories (nombre, slug, tipo, descripcion, orden, activa)
SELECT 'Burros', 'burros', 'producto', 'Animales de silla y trabajo', 1, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = 'burros' AND tipo = 'producto'
);

INSERT INTO public.categories (nombre, slug, tipo, descripcion, orden, activa)
SELECT 'Mulares', 'mulares', 'producto', 'Línea mular del criadero', 2, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = 'mulares' AND tipo = 'producto'
);

INSERT INTO public.categories (nombre, slug, tipo, descripcion, orden, activa)
SELECT 'Cuidados', 'cuidados', 'blog', 'Guías de manejo y bienestar', 1, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = 'cuidados' AND tipo = 'blog'
);

INSERT INTO public.categories (nombre, slug, tipo, descripcion, orden, activa)
SELECT 'Genetica', 'genetica', 'blog', 'Artículos de genética y reproducción', 2, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = 'genetica' AND tipo = 'blog'
);

-- 5) Backfill blog_posts desde categoria textual
UPDATE public.blog_posts bp
SET categoria_id = c.id
FROM public.categories c
WHERE c.tipo = 'blog'
  AND c.activa = true
  AND lower(coalesce(bp.categoria, '')) = lower(c.nombre)
  AND bp.categoria_id IS NULL;

COMMIT;

-- =====================================================
-- EJECUCION
-- Pega este script en Supabase SQL Editor y ejecútalo una vez.
-- =====================================================
