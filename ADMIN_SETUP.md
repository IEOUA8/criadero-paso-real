# Admin User Setup Guide - Criadero Paso Real

This guide provides step-by-step instructions for creating and configuring the admin user account for Criadero Paso Real in Supabase.

## Prerequisites

Before you begin, ensure you have:

- ✅ Access to your Supabase project dashboard
- ✅ Admin privileges in Supabase (ability to create users and run SQL queries)
- ✅ Access to the SQL Editor in Supabase
- ✅ A secure password manager to store credentials

## Important: Role Value Format

**CRITICAL:** The database constraint requires all role values to be **lowercase**. When creating admin users, you MUST use `'admin'` (lowercase), not `'Admin'` (capitalized). This applies to all role assignments.

Valid role values:
- `'user'` (default for new signups)
- `'admin'` (for administrators)
- `'moderator'` (for content moderators)

## Step 1: Create Auth User in Supabase Dashboard

1. **Navigate to Authentication**
   - Open your Supabase project dashboard
   - Click on **Authentication** in the left sidebar
   - Select **Users** from the submenu

2. **Add New User**
   - Click the **"Add User"** button (top right)
   - A modal will appear with user creation form

3. **Enter Admin Credentials**