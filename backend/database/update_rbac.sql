-- Step 1: Add the Role ENUM to the existing users table
CREATE TYPE user_role AS ENUM ('subscriber', 'admin');

ALTER TABLE users 
ADD COLUMN role user_role DEFAULT 'subscriber' NOT NULL;

-- Step 2: Enable Row Level Security (RLS) on all fundamental tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;

-- Step 3: Users Table Policies --
------------------------------------
-- A user can read/update their own profile
CREATE POLICY "Users can read own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- Admins can read & modify any user profile
CREATE POLICY "Admins have full access to users" 
ON users FOR ALL 
USING ( (SELECT role FROM users WHERE id = auth.uid()) = 'admin' );


-- Step 4: Scores Table Policies --
------------------------------------
-- Users can read, insert, and update their OWN scores
CREATE POLICY "Users can read own scores" 
ON scores FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores" 
ON scores FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scores" 
ON scores FOR UPDATE 
USING (auth.uid() = user_id);

-- Admins can see and edit everyone's scores
CREATE POLICY "Admins have full access to scores" 
ON scores FOR ALL 
USING ( (SELECT role FROM users WHERE id = auth.uid()) = 'admin' );


-- Step 5: Charities Table Policies --
---------------------------------------
-- Public/subscribers can read the directory
CREATE POLICY "Anyone can read charities"
ON charities FOR SELECT
USING (true);

-- Only Admins can add or update charities
CREATE POLICY "Admins can manage charities"
ON charities FOR ALL
USING ( (SELECT role FROM users WHERE id = auth.uid()) = 'admin' );


-- Step 6: Draws Table Policies --
------------------------------------
-- Public can read past (completed) draws
CREATE POLICY "Anyone can read past draws"
ON draws FOR SELECT
USING (status = 'completed');

-- Only Admins can run/manage new draws
CREATE POLICY "Admins can manage draws"
ON draws FOR ALL
USING ( (SELECT role FROM users WHERE id = auth.uid()) = 'admin' );
