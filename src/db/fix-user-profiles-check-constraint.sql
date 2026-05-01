-- =====================================================
-- DATABASE MIGRATION: Fix user_profiles CHECK Constraint
-- Criadero Paso Real - Allow NULL teléfono and ciudad
-- =====================================================
-- 
-- PROBLEM: 
-- The user_profiles table has an overly restrictive CHECK constraint
-- that may be rejecting valid user insertions when teléfono or ciudad
-- are NULL, even though these fields should be optional.
--
-- ERROR MESSAGE:
-- "new row for relation 'user_profiles' violates check constraint 'user_profiles_rol_check'"
--
-- ROOT CAUSE:
-- The CHECK constraint may have been validating more than just rol values,
-- or there may be an implicit NOT NULL constraint on teléfono/ciudad columns
-- that is preventing user registration.
--
-- SOLUTION:
-- 1. Drop the existing problematic CHECK constraint
-- 2. Ensure teléfono and ciudad columns explicitly allow NULL values
-- 3. Create a new CHECK constraint that ONLY validates rol enumeration
-- 4. Test that users can be created with NULL optional fields
-- =====================================================

-- =====================================================
-- STEP 1: Diagnostic - View Current Constraints
-- =====================================================
-- Run this first to understand the current state
SELECT 
    constraint_name, 
    check_clause 
FROM 
    information_schema.check_constraints 
WHERE 
    constraint_schema = 'public'
    AND constraint_name LIKE '%user_profiles%';

-- View column nullability
SELECT 
    column_name, 
    is_nullable,
    data_type,
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public'
    AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- =====================================================
-- STEP 2: Drop Existing Problematic CHECK Constraints
-- =====================================================
-- Drop the rol check constraint to recreate it properly
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_rol_check CASCADE;

-- Drop any other check constraints that might exist
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_check CASCADE;

-- =====================================================
-- STEP 3: Ensure Optional Columns Allow NULL
-- =====================================================
-- Explicitly make teléfono nullable
ALTER TABLE public.user_profiles 
ALTER COLUMN teléfono DROP NOT NULL;

-- Explicitly make ciudad nullable
ALTER TABLE public.user_profiles 
ALTER COLUMN ciudad DROP NOT NULL;

-- Verify apellidos is also nullable (it should be)
ALTER TABLE public.user_profiles 
ALTER COLUMN apellidos DROP NOT NULL;

-- =====================================================
-- STEP 4: Create New Simplified CHECK Constraint
-- =====================================================
-- This constraint ONLY validates rol values
-- It does NOT validate any other columns
-- It allows NULL in teléfono, ciudad, and apellidos
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_rol_check 
CHECK (rol IN ('user', 'admin', 'moderator', 'superuser', 'Editor'));

-- =====================================================
-- STEP 5: Add Comment to Document Change
-- =====================================================
COMMENT ON CONSTRAINT user_profiles_rol_check ON public.user_profiles IS 
'Validates that rol column only contains allowed values: user, admin, moderator, superuser, Editor. Does not validate any other columns. Contact fields (teléfono, ciudad) are optional and may be NULL.';

-- =====================================================
-- STEP 6: Verification Queries
-- =====================================================
-- Verify the new constraint is in place
SELECT 
    constraint_name, 
    check_clause 
FROM 
    information_schema.check_constraints 
WHERE 
    constraint_schema = 'public'
    AND constraint_name = 'user_profiles_rol_check';

-- Expected output:
-- constraint_name: user_profiles_rol_check
-- check_clause: (rol = ANY (ARRAY['user'::text, 'admin'::text, 'moderator'::text, 'superuser'::text, 'Editor'::text]))

-- Verify column nullability (should all be YES except id, nombre, rol, created_at)
SELECT 
    column_name, 
    is_nullable,
    data_type
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public'
    AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- =====================================================
-- STEP 7: Test Inserts (Validation)
-- =====================================================
-- Test 1: Insert user with all NULL optional fields (should succeed)
BEGIN;
    INSERT INTO public.user_profiles (id, nombre, apellidos, teléfono, ciudad, rol, created_at)
    VALUES (
        gen_random_uuid(),
        'TestUser',
        NULL,      -- apellidos NULL - should work
        NULL,      -- teléfono NULL - should work
        NULL,      -- ciudad NULL - should work
        'user',    -- valid rol
        NOW()
    );
ROLLBACK;

-- Test 2: Insert user with only nombre and rol (should succeed)
BEGIN;
    INSERT INTO public.user_profiles (id, nombre, rol, created_at)
    VALUES (
        gen_random_uuid(),
        'MinimalUser',
        'user',
        NOW()
    );
ROLLBACK;

-- Test 3: Insert with invalid rol (should fail)
BEGIN;
    INSERT INTO public.user_profiles (id, nombre, rol, created_at)
    VALUES (
        gen_random_uuid(),
        'InvalidRol',
        'SuperAdmin',  -- Invalid - should fail constraint
        NOW()
    );
ROLLBACK;
-- Expected: ERROR - violates check constraint "user_profiles_rol_check"

-- =====================================================
-- STEP 8: Update Existing NULL Roles to Default
-- =====================================================
-- If any existing records have NULL rol, set to default 'user'
UPDATE public.user_profiles 
SET rol = 'user' 
WHERE rol IS NULL;

-- =====================================================
-- MIGRATION SUMMARY
-- =====================================================
-- Changes Applied:
-- 1. ✅ Dropped overly restrictive CHECK constraints
-- 2. ✅ Made teléfono column nullable
-- 3. ✅ Made ciudad column nullable  
-- 4. ✅ Made apellidos column nullable
-- 5. ✅ Created new CHECK constraint for rol values only
-- 6. ✅ Updated any NULL roles to default 'user'
--
-- Allowed Values:
-- - rol: 'user', 'admin', 'moderator', 'superuser', 'Editor'
-- - teléfono: any text or NULL
-- - ciudad: any text or NULL
-- - apellidos: any text or NULL
--
-- Required Fields:
-- - id (UUID, primary key)
-- - nombre (text, required)
-- - rol (text, required, must be from allowed list)
-- - created_at (timestamp, required)
-- =====================================================