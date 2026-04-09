CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  domain VARCHAR(120) NOT NULL,
  language_level VARCHAR(2) NOT NULL CHECK (language_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  source VARCHAR(80) NOT NULL DEFAULT 'assistant-virtuel',
  recommended_agent VARCHAR(120),
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
  assignment_reason VARCHAR(140) NOT NULL DEFAULT 'assistant-virtuel-routing',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_assignments_lead_id ON lead_assignments (lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_assignments_agent_id ON lead_assignments (agent_id);

INSERT INTO agents (full_name, phone, specialties)
VALUES
  ('Youssef', '212600111111', 'Pflege,Altenpflege,IT Support'),
  ('Sara', '212600222222', 'Koch / Köchin,Gastronomie,Hotellerie'),
  ('Hamza', '212600333333', 'Mechaniker/in,KFZ-Technik,Mechatroniker/in,Elektriker/in'),
  ('Meryem', '212600444444', 'Lagerlogistik,Verkäufer/in')
ON CONFLICT (phone) DO NOTHING;
