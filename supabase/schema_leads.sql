-- Esquema de Prospectos / Leads para Kia El Marqués
-- Ejecutar en Supabase SQL Editor: https://supabase.com/dashboard/project/sgnkqstfigkjmitklhar/sql/new

CREATE TABLE IF NOT EXISTS vehicle_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  model_interest TEXT,
  primary_use TEXT,
  buyer_type TEXT,
  favorite_color TEXT,
  financing_interest TEXT,
  timeline TEXT,
  notes TEXT,
  status TEXT DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'contactado', 'en_seguimiento', 'cerrado', 'descartado')),
  utm_source TEXT,
  utm_campaign TEXT
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE vehicle_leads ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir INSERT público desde el cuestionario web (sin registro previo)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vehicle_leads' AND policyname = 'Permitir inserción pública de leads') THEN
    CREATE POLICY "Permitir inserción pública de leads" ON vehicle_leads FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vehicle_leads' AND policyname = 'Permitir lectura y gestión con service role') THEN
    CREATE POLICY "Permitir lectura y gestión con service role" ON vehicle_leads FOR ALL USING (true);
  END IF;
END $$;
