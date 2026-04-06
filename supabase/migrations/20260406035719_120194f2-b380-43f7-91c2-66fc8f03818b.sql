
-- 1. Add foreign keys with CASCADE to profiles and user_roles
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_roles
  DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey,
  ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Make bookings.user_id NOT NULL so RLS insert policy works reliably
ALTER TABLE public.bookings
  ALTER COLUMN user_id SET NOT NULL;

-- 3. Add foreign key on bookings.user_id
ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_user_id_fkey,
  ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Add provider SELECT policy on bookings (tutors can view bookings assigned to their intakes)
CREATE POLICY "Providers can view assigned bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'provider'::app_role));

-- 5. Add provider SELECT policy on intakes
CREATE POLICY "Providers can view assigned intakes"
  ON public.intakes
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'provider'::app_role));

-- 6. Add provider UPDATE on intakes (to update progress/status)
CREATE POLICY "Providers can update assigned intakes"
  ON public.intakes
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'provider'::app_role))
  WITH CHECK (has_role(auth.uid(), 'provider'::app_role));
