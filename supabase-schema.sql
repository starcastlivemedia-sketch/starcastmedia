-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  department VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  status VARCHAR(50) DEFAULT 'active',
  hire_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Timesheets table
CREATE TABLE IF NOT EXISTS timesheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  hours_worked DECIMAL(5, 2) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(100),
  document_type VARCHAR(100),
  visibility VARCHAR(50) DEFAULT 'private',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Team memberships table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  role VARCHAR(100),
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, team_id)
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_user_id ON timesheets(user_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_date ON timesheets(date);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);

-- Enable Row Level Security (RLS)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees table
CREATE POLICY "Users can view their own employee profile" ON employees
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM employees WHERE id = employees.id
  ));

CREATE POLICY "Users can update their own employee profile" ON employees
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view team members if in same team" ON employees
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM team_members 
      WHERE team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    ) OR auth.uid() = user_id
  );

-- RLS Policies for timesheets table
CREATE POLICY "Users can view their own timesheets" ON timesheets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own timesheets" ON timesheets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own timesheets" ON timesheets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own timesheets" ON timesheets
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for documents table
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id OR visibility = 'public');

CREATE POLICY "Users can insert their own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for team_members table
CREATE POLICY "Users can view their own memberships" ON team_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all team members" ON team_members
  FOR SELECT USING (true);

CREATE POLICY "Team creators can add members" ON team_members
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT created_by FROM teams WHERE id = team_id)
  );

CREATE POLICY "Team creators can remove members" ON team_members
  FOR DELETE USING (
    auth.uid() IN (SELECT created_by FROM teams WHERE id = team_id)
  );

-- RLS Policies for teams table
CREATE POLICY "Users can create teams" ON teams
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admin can view all teams" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Team creators can update their teams" ON teams
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Team creators can delete their teams" ON teams
  FOR DELETE USING (created_by = auth.uid());
