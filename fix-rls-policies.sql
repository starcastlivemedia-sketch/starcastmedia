-- Fix RLS Policies to resolve 500 errors
-- Run this in Supabase SQL Editor

DROP POLICY IF EXISTS "Users can view their own employee profile" ON employees;
DROP POLICY IF EXISTS "Users can view team members if in same team" ON employees;

CREATE POLICY "Users can view their own employee profile" ON employees
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own employee profile" ON employees
  FOR INSERT WITH CHECK (auth.uid() = user_id);
