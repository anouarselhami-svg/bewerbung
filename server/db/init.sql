CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  domain VARCHAR(120) NOT NULL,
  target_countries TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  language_level VARCHAR(2) NOT NULL CHECK (language_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  source VARCHAR(80) NOT NULL DEFAULT 'site-web',
  recommended_agent VARCHAR(120),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'cancelled')),
  status_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);

CREATE TABLE IF NOT EXISTS agents (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL UNIQUE,
  specialties TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_assignments (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  agent_id BIGINT NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,
  assignment_reason VARCHAR(140) NOT NULL DEFAULT 'routing-manuel',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_assignments_lead_id ON lead_assignments (lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_assignments_agent_id ON lead_assignments (agent_id);

CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  author_name VARCHAR(80) NOT NULL,
  message VARCHAR(800) NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments (created_at DESC);

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(60) NOT NULL,
  path VARCHAR(200) NOT NULL,
  source VARCHAR(100),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_agent TEXT,
  ip_address VARCHAR(80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events (event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events (created_at DESC);

INSERT INTO agents (full_name, phone, specialties)
VALUES
  ('Contact 1', '212664879503', 'Pflege,Altenpflege,IT Support,Koch / Köchin,Gastronomie,Hotellerie,Mechaniker/in,Mechatroniker/in,Elektriker/in,Lagerlogistik,Verkäufer/in,KFZ-Technik'),
  ('Contact 2', '212671078310', 'Pflege,Altenpflege,IT Support,Koch / Köchin,Gastronomie,Hotellerie,Mechaniker/in,Mechatroniker/in,Elektriker/in,Lagerlogistik,Verkäufer/in,KFZ-Technik')
ON CONFLICT (phone) DO NOTHING;
