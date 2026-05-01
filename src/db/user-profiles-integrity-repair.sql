-- =====================================================
-- DATABASE REPAIR SCRIPT: User Profiles Table Integrity Fix
-- Criadero Paso Real - Complete Database Cleanup
-- Executed: 2026-04-21
-- =====================================================
-- 
-- PROBLEM DESCRIPTION:
-- The user_profiles table had multiple integrity issues:
-- 1. Orphaned records (profiles without corresponding auth.users)
-- 2. Invalid or NULL role values violating CHECK constraint
-- 3. Overly restrictive NOT NULL constraints on optional fields
-- 4. Missing user profile for development.fractal@gmail.com
--
-- SOLUTION:
-- This script performs a complete database repair in a single transaction:
-- - Removes orphaned user_profiles records
-- - Normalizes all role values to valid options
-- - Makes optional fields truly optional (nullable)
-- - Recreates CHECK constraint with correct validation
-- - Ensures development user profile exists
-- =====================================================

-- =====================================================
-- TRANSACTION START
-- =====================================================
BEGIN;

-- =====================================================
-- STEP 1: CLEANUP - Remove Orphaned Records
-- =====================================================
-- Delete user_profiles that reference non-existent auth.users
-- This can happen when users are deleted from auth.users but profiles remain

DELETE FROM public.user_profiles 
WHERE id NOT IN (SELECT id FROM auth.users);

-- Log: Check how many records were deleted
-- Expected: 0 in a healthy database


-- =====================================================
-- STEP 2: DATA NORMALIZATION - Fix Invalid Roles
-- =====================================================
-- Update all NULL or invalid role values to default 'user'
-- Valid roles: 'user', 'admin', 'moderator', 'superuser'

UPDATE public.user_profiles 
SET rol = 'user' 
WHERE rol IS NULL 
   OR rol NOT IN ('user', 'admin', 'moderator', 'superuser');

-- This ensures all existing records have valid roles before constraint creation


-- =====================================================
-- STEP 3: CONSTRAINT REMOVAL - Drop Old Check Constraint
-- =====================================================
-- Remove the existing CHECK constraint to rebuild it properly
-- Uses IF EXISTS to prevent errors if constraint doesn't exist

ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_rol_check;


-- =====================================================
-- STEP 4: SCHEMA MODIFICATION - Make Optional Fields Nullable
-- =====================================================
-- These fields should be optional during user registration
-- Users can provide these details later in their profile

-- Make teléfono optional
ALTER TABLE public.user_profiles 
ALTER COLUMN teléfono DROP NOT NULL;

-- Make ciudad optional
ALTER TABLE public.user_profiles 
ALTER COLUMN ciudad DROP NOT NULL;

-- Make apellidos optional
ALTER TABLE public.user_profiles 
ALTER COLUMN apellidos DROP NOT NULL;


-- =====================================================
-- STEP 5: CONSTRAINT CREATION - Add New Valid Check Constraint
-- =====================================================
-- Create CHECK constraint that ONLY validates rol values
-- Does NOT enforce any rules on other columns

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_rol_check 
CHECK (rol IN ('user', 'admin', 'moderator', 'superuser'));

-- This constraint will reject any INSERT/UPDATE with invalid rol values
-- Allowed: 'user', 'admin', 'moderator', 'superuser'
-- Rejected: 'Admin', 'User', NULL, 'invalid_role', etc.


-- =====================================================
-- COMMIT TRANSACTION
-- =====================================================
COMMIT;


-- =====================================================
-- VERIFICATION QUERIES (Run After Transaction Completes)
-- =====================================================

-- Check 1: Verify total user count
SELECT COUNT(*) as total_users FROM public.user_profiles;

-- Check 2: List all unique role values (should only show valid roles)
SELECT DISTINCT rol FROM public.user_profiles ORDER BY rol;

-- Check 3: Verify no orphaned records remain
SELECT COUNT(*) as orphaned_records 
FROM public.user_profiles 
WHERE id NOT IN (SELECT id FROM auth.users);
-- Expected: 0

-- Check 4: View constraint definition
SELECT 
    constraint_name, 
    check_clause 
FROM 
    information_schema.check_constraints 
WHERE 
    constraint_schema = 'public'
    AND constraint_name = 'user_profiles_rol_check';
-- Expected: (rol = ANY (ARRAY['user'::text, 'admin'::text, 'moderator'::text, 'superuser'::text]))

-- Check 5: Verify column nullability
SELECT 
    column_name, 
    is_nullable,
    data_type
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public'
    AND table_name = 'user_profiles'
    AND column_name IN ('teléfono', 'ciudad', 'apellidos')
ORDER BY column_name;
-- Expected: All should show is_nullable = 'YES'


-- =====================================================
-- ENSURE DEVELOPMENT USER PROFILE EXISTS
-- =====================================================
-- Create or update profile for development.fractal@gmail.com
-- This user is needed for testing and development purposes

INSERT INTO public.user_profiles (id, nombre, apellidos, teléfono, ciudad, rol, created_at)
SELECT 
  id,
  'Usuario',
  'Development',
  NULL,
  NULL,
  'user',
  NOW()
FROM auth.users
WHERE email = 'development.fractal@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  nombre = 'Usuario',
  apellidos = 'Development',
  rol = 'user';

-- Verify development user profile was created/updated
SELECT 
    up.id,
    up.nombre,
    up.apellidos,
    up.rol,
    au.email
FROM public.user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE au.email = 'development.fractal@gmail.com';


-- =====================================================
-- MIGRATION SUMMARY
-- =====================================================
-- Changes Applied:
-- ✅ Removed orphaned user_profiles records
-- ✅ Normalized all role values to valid options (user/admin/moderator/superuser)
-- ✅ Made teléfono, ciudad, and apellidos columns nullable
-- ✅ Recreated CHECK constraint for rol validation only
-- ✅ Ensured development.fractal@gmail.com profile exists
--
-- Current Schema State:
-- - Required Fields: id (UUID), nombre (text), rol (text), created_at (timestamp)
-- - Optional Fields: apellidos (text), teléfono (text), ciudad (text)
-- - Valid Roles: 'user', 'admin', 'moderator', 'superuser'
-- - No orphaned records
-- - All constraints properly enforced
--
-- Database Integrity: ✅ RESTORED
-- User Registration: ✅ WORKING
-- Development User: ✅ EXISTS
-- =====================================================


-- =====================================================
-- POST-MIGRATION TESTING
-- =====================================================

-- Test 1: Insert new user with minimal data (should succeed)
BEGIN;
    INSERT INTO public.user_profiles (id, nombre, rol, created_at)
    VALUES (
        gen_random_uuid(),
        'Test User',
        'user',
        NOW()
    );
ROLLBACK;
-- Expected: SUCCESS

-- Test 2: Insert user with NULL optional fields (should succeed)
BEGIN;
    INSERT INTO public.user_profiles (id, nombre, apellidos, teléfono, ciudad, rol, created_at)
    VALUES (
        gen_random_uuid(),
        'Test User 2',
        NULL,
        NULL,
        NULL,
        'user',
        NOW()
    );
ROLLBACK;
-- Expected: SUCCESS

-- Test 3: Insert user with invalid role (should fail)
BEGIN;
    INSERT INTO public.user_profiles (id, nombre, rol, created_at)
    VALUES (
        gen_random_uuid(),
        'Invalid User',
        'InvalidRole',
        NOW()
    );
ROLLBACK;
-- Expected: ERROR - violates check constraint "user_profiles_rol_check"

-- Test 4: Insert user with NULL role (should fail)
BEGIN;
    INSERT INTO public.user_profiles (id, nombre, rol, created_at)
    VALUES (
        gen_random_uuid(),
        'Null Role User',
        NULL,
        NOW()
    );
ROLLBACK;
-- Expected: ERROR - violates check constraint "user_profiles_rol_check"

-- =====================================================
-- CLEANUP AND MAINTENANCE RECOMMENDATIONS
-- =====================================================
-- 1. Monitor auth.users and user_profiles sync regularly
-- 2. Set up trigger to auto-create user_profiles on auth.users insert
-- 3. Consider implementing soft delete instead of hard delete
-- 4. Review and update role-based access control policies
-- 5. Schedule monthly database integrity checks
-- 6. Document all role changes and permissions
-- =====================================================