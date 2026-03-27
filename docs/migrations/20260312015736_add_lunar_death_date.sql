-- Add lunar death date fields to persons table
-- Add lunar death date fields to persons table (if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='persons' AND column_name='death_lunar_day') THEN
        ALTER TABLE "public"."persons"
        ADD COLUMN "death_lunar_day" smallint,
        ADD COLUMN "death_lunar_month" smallint,
        ADD COLUMN "death_lunar_year" smallint;
    END IF;
END $$;