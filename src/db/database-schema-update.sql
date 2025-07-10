-- TaskFlow Database Schema Update
-- Fix RLS policy to allow users to view all user records for task assignment
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;

CREATE POLICY "Authenticated users can view all user records" ON public.users
  FOR SELECT USING (auth.uid() IS NOT NULL);