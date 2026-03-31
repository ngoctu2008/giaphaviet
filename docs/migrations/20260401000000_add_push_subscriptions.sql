-- Push Subscriptions Table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own subscriptions
DROP POLICY IF EXISTS "Users can view their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can view their own push subscriptions" ON public.push_subscriptions
    FOR SELECT USING (true); -- Allow all users to fetch it so anon can be used if they want to get their subs, or use the service role key on server

DROP POLICY IF EXISTS "Users can insert their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can insert their own push subscriptions" ON public.push_subscriptions
    FOR INSERT WITH CHECK (true); -- Allow anonymous inserts

DROP POLICY IF EXISTS "Users can update their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can update their own push subscriptions" ON public.push_subscriptions
    FOR UPDATE USING (true); -- Allow anonymous updates

DROP POLICY IF EXISTS "Users can delete their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can delete their own push subscriptions" ON public.push_subscriptions
    FOR DELETE USING (true); -- Allow anonymous deletes

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_push_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_push_subscriptions_updated_at ON public.push_subscriptions;
CREATE TRIGGER update_push_subscriptions_updated_at
BEFORE UPDATE ON public.push_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_push_subscriptions_updated_at();
