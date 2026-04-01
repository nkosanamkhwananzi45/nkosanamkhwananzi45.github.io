
-- 1. Drop the overly permissive "Read own bookings" policy that exposes guest bookings to anonymous users
DROP POLICY IF EXISTS "Read own bookings" ON public.bookings;

-- 2. Drop the duplicate SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view own bookings" ON public.bookings;

-- 3. Create a single secure SELECT policy: authenticated users can only see their own bookings
CREATE POLICY "Authenticated users can view own bookings"
ON public.bookings FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- 4. Tighten INSERT policy: remove anon access, require user_id = auth.uid()
DROP POLICY IF EXISTS "Insert bookings" ON public.bookings;
CREATE POLICY "Authenticated users can insert bookings"
ON public.bookings FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- 5. Add UPDATE policy for booking owners (limited to notes only via RLS scope)
CREATE POLICY "Users can update own bookings"
ON public.bookings FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 6. Add admin SELECT policy on bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 7. Add admin UPDATE policy on bookings
CREATE POLICY "Admins can update all bookings"
ON public.bookings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 8. Fix intakes policies: use has_role() instead of raw_user_meta_data
DROP POLICY IF EXISTS "Admins can create intakes" ON public.intakes;
DROP POLICY IF EXISTS "Admins can delete intakes" ON public.intakes;
DROP POLICY IF EXISTS "Admins can update intakes" ON public.intakes;
DROP POLICY IF EXISTS "Admins can view all intakes" ON public.intakes;

CREATE POLICY "Admins can view all intakes"
ON public.intakes FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create intakes"
ON public.intakes FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update intakes"
ON public.intakes FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete intakes"
ON public.intakes FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
