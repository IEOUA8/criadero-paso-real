-- =====================================================
-- FIX RLS: ORDERS / ORDER_ITEMS / CATEGORIES
-- Criadero Paso Real
-- =====================================================
-- Objetivo:
-- 1) Permitir que usuarios autenticados creen pedidos propios
-- 2) Permitir lectura/edición de pedidos para administradores
-- 3) Permitir CRUD de categories a administradores
--
-- Requisito:
-- La tabla public.user_profiles debe existir con columnas:
-- - id (uuid)
-- - rol (text) con valor 'admin' para administradores
-- =====================================================

BEGIN;

-- Helper function para verificar rol admin
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

-- -----------------------------------------------------
-- ORDERS
-- -----------------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS orders_select_own_or_admin ON public.orders;
CREATE POLICY orders_select_own_or_admin
ON public.orders
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS orders_insert_own ON public.orders;
CREATE POLICY orders_insert_own
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

DROP POLICY IF EXISTS orders_update_admin_only ON public.orders;
CREATE POLICY orders_update_admin_only
ON public.orders
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS orders_delete_admin_only ON public.orders;
CREATE POLICY orders_delete_admin_only
ON public.orders
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- -----------------------------------------------------
-- ORDER ITEMS
-- -----------------------------------------------------
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS order_items_select_own_or_admin ON public.order_items;
CREATE POLICY order_items_select_own_or_admin
ON public.order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = order_items.order_id
      AND (o.user_id = auth.uid() OR public.is_admin(auth.uid()))
  )
);

DROP POLICY IF EXISTS order_items_insert_own_or_admin ON public.order_items;
CREATE POLICY order_items_insert_own_or_admin
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = order_items.order_id
      AND (o.user_id = auth.uid() OR public.is_admin(auth.uid()))
  )
);

DROP POLICY IF EXISTS order_items_update_admin_only ON public.order_items;
CREATE POLICY order_items_update_admin_only
ON public.order_items
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS order_items_delete_admin_only ON public.order_items;
CREATE POLICY order_items_delete_admin_only
ON public.order_items
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- -----------------------------------------------------
-- CATEGORIES
-- -----------------------------------------------------
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

COMMIT;

-- =====================================================
-- EJECUCION
-- Ejecuta este archivo en Supabase SQL Editor:
-- src/db/fix-orders-and-categories-rls.sql
-- =====================================================
