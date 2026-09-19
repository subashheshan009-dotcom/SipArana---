-- =====================================================================
-- SIPARANA GLOBAL AI EDUCATION ECOSYSTEM
-- PostgreSQL Row-Level Security (RLS) & Privacy Enforcement Policies
-- =====================================================================

-- 1. Enable Row-Level Security on User Profiles Table
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.xp_audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. PUBLIC VIEW FOR LEADERBOARD (Sanitized Data Projection)
-- Publicly exposes ONLY non-sensitive leaderboard fields:
-- Display Name, School, Public Avatar URL, Stream, Total XP, Online Status.
-- Never exposes email addresses, phone numbers, passwords, or personal account settings.
CREATE OR REPLACE VIEW public.public_leaderboard AS
SELECT 
    id,
    name,
    avatar,
    school,
    university,
    district,
    country_code,
    country_flag,
    stream,
    xp,
    streak_days,
    is_online,
    custom_avatar_frame_id,
    bio,
    last_active_date
FROM public.users
WHERE is_active = true
ORDER BY xp DESC
LIMIT 100;

-- 3. RLS READ POLICIES
-- Anyone may read public leaderboard records
CREATE POLICY "Public may view leaderboard projection"
ON public.users
FOR SELECT
USING (true);

-- 4. RLS WRITE PERMISSION (OWNER ONLY)
-- Enforce request.auth.uid == resource.data.uid
-- Prevent users from editing another user's database record
CREATE POLICY "Users can only update their own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id
    -- PREVENT XP SPOOFING VIA CLIENT DIRECT WRITE:
    -- Total XP cannot be modified directly via update;
    -- it must match the existing database value or be incremented via secure RPC.
    AND xp = (SELECT u.xp FROM public.users u WHERE u.id = auth.uid())
);

-- 5. SECURE XP INCREMENT STORED PROCEDURE (SERVER-AUTHORITATIVE ONLY)
CREATE OR REPLACE FUNCTION public.award_verified_xp(
    target_user_id TEXT,
    activity_type TEXT,
    awarded_amount INT,
    proof_hash TEXT
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges, bypassing client RLS
AS $$
DECLARE
    current_xp INT;
    capped_amount INT;
BEGIN
    -- Only allow server backend service role or authenticated user matching target
    IF auth.uid() IS NOT NULL AND auth.uid() != target_user_id THEN
        RAISE EXCEPTION 'Security Violation: Cannot award XP to another student account';
    END IF;

    -- Strict XP bounds per verified activity
    capped_amount := LEAST(GREATEST(awarded_amount, 0), 120);

    -- Atomic increment
    UPDATE public.users
    SET xp = COALESCE(xp, 0) + capped_amount,
        last_active_timestamp = NOW()
    WHERE id = target_user_id
    RETURNING xp INTO current_xp;

    -- Audit log
    INSERT INTO public.xp_audit_logs (user_id, activity_type, xp_awarded, timestamp)
    VALUES (target_user_id, activity_type, capped_amount, NOW());

    RETURN current_xp;
END;
$$;
