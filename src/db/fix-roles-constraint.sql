-- =====================================================
-- DATABASE MIGRATION: Fix Role Constraint Issue
-- Criadero Paso Real - User Profiles Role Normalization
-- =====================================================
-- 
-- PROBLEM: 
-- The user_profiles table has a check constraint that only allows lowercase role values:
-- 'user', 'admin', 'moderator'
-- 
-- However, the application was previously using capitalized values like 'Admin',
-- causing constraint violations on INSERT/UPDATE operations.
--
-- SOLUTION:
-- 1. Update all existing records to use lowercase role values
-- 2. Verify the constraint is working correctly
-- 3. Update application code to always use lowercase values
-- =====================================================

-- =====================================================
-- STEP 1: Check Current Constraint (Diagnostic Query)
-- =====================================================
-- Run this to verify the current constraint definition:

SELECT 
    constraint_name, 
    check_clause 
FROM 
    information_schema.check_constraints 
WHERE 
    table_name = 'user_profiles' 
    AND constraint_name LIKE '%rol%';

-- Expected output should show:
-- constraint_name: user_profiles_rol_check
-- check_clause: (rol = ANY (ARRAY['user'::text, 'admin'::text, 'moderator'::text]))


-- =====================================================
-- STEP 2: View Current Roles (Before Migration)
-- =====================================================
-- Check what role values currently exist in the database:

SELECT DISTINCT rol 
FROM public.user_profiles 
ORDER BY rol;

-- This will show any capitalized or invalid role values


-- =====================================================
-- STEP 3: Normalize All Role Values to Lowercase
-- =====================================================
-- Update all existing user profiles to use lowercase roles:

-- Convert 'Admin' to 'admin'
UPDATE public.user_profiles 
SET rol = 'admin' 
WHERE LOWER(rol) = 'admin' AND rol != 'admin';

-- Convert 'User' to 'user'
UPDATE public.user_profiles 
SET rol = 'user' 
WHERE LOWER(rol) = 'user' AND rol != 'user';

-- Convert 'Moderator' to 'moderator'
UPDATE public.user_profiles 
SET rol = 'moderator' 
WHERE LOWER(rol) = 'moderator' AND rol != 'moderator';

-- Handle any null or invalid roles by setting them to default 'user'
UPDATE public.user_profiles 
SET rol = 'user' 
WHERE rol IS NULL 
   OR LOWER(rol) NOT IN ('user', 'admin', 'moderator');


-- =====================================================
-- STEP 4: Verify Migration (Post-Migration Check)
-- =====================================================
-- Verify that all roles are now lowercase and valid:

SELECT 
    rol, 
    COUNT(*) as count 
FROM public.user_profiles 
GROUP BY rol 
ORDER BY rol;

-- Expected output should only show: 'admin', 'moderator', 'user'


-- =====================================================
-- STEP 5: Test Constraint (Optional Validation)
-- =====================================================
-- Test that the constraint correctly rejects invalid values:
-- (This should fail - do NOT commit this transaction)

BEGIN;
    UPDATE public.user_profiles 
    SET rol = 'Admin' 
    WHERE id = (SELECT id FROM public.user_profiles LIMIT 1);
ROLLBACK;

-- Expected: ERROR - new row for relation "user_profiles" violates check constraint


-- =====================================================
-- STEP 6: Create Admin User (If Needed)
-- =====================================================
-- If you need to manually create an admin user after authentication:
-- Replace 'YOUR_USER_UUID_HERE' with the actual UUID from auth.users

-- Example:
/*
INSERT INTO public.user_profiles (id, nombre, apellidos, teléfono, ciudad, rol, created_at)
VALUES (
  'YOUR_USER_UUID_HERE'::uuid,
  'Administrador',
  'Criadero Paso Real',
  '+57 300 123 4567',
  'Santa Fe de Antioquia',
  'admin',  -- Note: lowercase 'admin'
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  apellidos = EXCLUDED.apellidos,
  rol = EXCLUDED.rol;
*/


-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- After running this migration:
-- 1. All existing users should have lowercase role values
-- 2. Application code has been updated to use lowercase values
-- 3. New user signups will automatically use lowercase 'user' role
-- 4. Admin users can be created through Supabase dashboard + manual SQL insert
-- 
-- NEXT STEPS:
-- - Test admin login functionality
-- - Verify /admin/inventario page is accessible for admin users
-- - Monitor application logs for any remaining role-related errors
-- =====================================================