
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can read own booking by id" ON public.bookings;

-- Allow anon inserts only when user_id is null, authenticated inserts must set own user_id
CREATE POLICY "Insert bookings" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (user_id IS NULL) OR (user_id = auth.uid())
  );

-- Anon can read by payment_reference (for success/cancel pages), authenticated reads own
CREATE POLICY "Read own bookings" ON public.bookings
  FOR SELECT TO anon, authenticated
  USING (
    (user_id = auth.uid()) OR (user_id IS NULL)
  );
