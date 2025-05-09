
-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Service givers can view pet owner profiles" 
  ON public.users FOR SELECT 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'giver');

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- Pets table policies
CREATE POLICY "Pet owners can manage their pets" 
  ON public.pets FOR ALL 
  USING (auth.uid() = owner_id);

CREATE POLICY "Service givers can view all pets" 
  ON public.pets FOR SELECT 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'giver');

-- Service requests policies
CREATE POLICY "Pet owners can manage their requests" 
  ON public.service_requests FOR ALL 
  USING (auth.uid() = owner_id);

CREATE POLICY "Service givers can view all service requests" 
  ON public.service_requests FOR SELECT 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'giver');

-- Service offers policies
CREATE POLICY "Service givers can manage their offers" 
  ON public.service_offers FOR ALL 
  USING (auth.uid() = giver_id);

CREATE POLICY "Pet owners can view offers for their requests" 
  ON public.service_offers FOR SELECT 
  USING (auth.uid() IN (
    SELECT owner_id FROM public.service_requests WHERE id = service_offers.request_id
  ));

-- Services policies
CREATE POLICY "Service givers can view and update their services" 
  ON public.services FOR ALL 
  USING (auth.uid() IN (
    SELECT giver_id FROM public.service_offers WHERE id = services.offer_id
  ));

CREATE POLICY "Pet owners can view services for their pets" 
  ON public.services FOR SELECT 
  USING (auth.uid() IN (
    SELECT owner_id FROM public.service_requests WHERE id = services.request_id
  ));

-- Verification policies
CREATE POLICY "Users can view their own verification" 
  ON public.verifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service givers can submit verification" 
  ON public.verifications FOR INSERT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service givers can update their verification" 
  ON public.verifications FOR UPDATE 
  USING (auth.uid() = user_id);
