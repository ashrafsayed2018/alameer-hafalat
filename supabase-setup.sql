-- ============================================
-- Supabase Setup for Alameer Hafalat Blog CMS
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create the posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE,
  excerpt     TEXT NOT NULL,
  content     TEXT NOT NULL,
  image_url   TEXT,
  post_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- If the table already exists, add the slug column:
-- ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 2. Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. Row Level Security: only authenticated users can write
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read posts (public blog)
CREATE POLICY "Public read access"
  ON public.posts FOR SELECT
  USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Auth users can insert"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users can update"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Auth users can delete"
  ON public.posts FOR DELETE
  TO authenticated
  USING (true);


-- ============================================
-- Storage Bucket Setup
-- Run these in the Supabase SQL Editor too
-- OR create manually in Storage dashboard
-- ============================================

-- Create the storage bucket for post images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: public read
CREATE POLICY "Public read post images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

-- Storage RLS: authenticated users can upload
CREATE POLICY "Auth users can upload post images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'post-images');

-- Storage RLS: authenticated users can update
CREATE POLICY "Auth users can update post images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'post-images');

-- Storage RLS: authenticated users can delete
CREATE POLICY "Auth users can delete post images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'post-images');


-- ============================================
-- Categories Table
-- ============================================

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read categories (used on public blog)
CREATE POLICY "Public read categories"
  ON public.categories FOR SELECT
  USING (true);

-- Only authenticated users can manage categories
CREATE POLICY "Auth users can insert categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users can update categories"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Auth users can delete categories"
  ON public.categories FOR DELETE
  TO authenticated
  USING (true);

-- 3. Add category_id FK to posts (run this if posts table already exists)
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- 4. Seed categories matching the content structure
INSERT INTO public.categories (name, slug) VALUES
  ('تأجير خيام', 'تأجير-خيام'),
  ('تأجير دفايات', 'تأجير-دفايات'),
  ('تأجير زينة اعراس', 'تأجير-زينة-اعراس'),
  ('تأجير كراسي وطاولات', 'تأجير-كراسي-وطاولات'),
  ('تأجير كراسي شفافة', 'تأجير-كراسي-شفافة'),
  ('تأجير كراسي عزاء', 'تأجير-كراسي-عزاء'),
  ('تأجير كراسي vip', 'تأجير-كراسي-vip'),
  ('تأجير كنب امريكي', 'تأجير-كنب-امريكي'),
  ('تأجير كنب مطروق', 'تأجير-كنب-مطروق'),
  ('تأجير مكيفات', 'تأجير-مكيفات'),
  ('تنسيق جميع الحفلات', 'تنسيق-جميع-الحفلات'),
  ('خدمة ضيافة نسائي', 'خدمة-ضيافة-نسائي'),
  ('خدمة ضيافة رجالى', 'خدمة-ضيافة-رجالى'),
  ('خدمة تفتيش تليفونات', 'خدمة-تفتيش-تليفونات'),
  ('تأجير فاليةاو باركن', 'تأجير-فاليه-باركن'),
  ('خطة محتوى', 'خطة-محتوى')
ON CONFLICT (slug) DO NOTHING;


-- ============================================
-- Gallery Storage Bucket
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read gallery"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Auth users can upload gallery"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Auth users can delete gallery"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery');
