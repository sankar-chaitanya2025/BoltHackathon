/*
  # Create metrics tables for load testing

  1. New Tables
    - `api_metrics`: Stores API endpoint performance metrics
    - `active_sessions`: Tracks concurrent user sessions
  
  2. Functions
    - `get_database_stats`: Returns database performance statistics
    
  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated access
*/

-- Create API metrics table
CREATE TABLE IF NOT EXISTS api_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL,
  method text NOT NULL,
  avg_response_time float NOT NULL,
  p95_response_time float NOT NULL,
  error_rate float NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Create active sessions table
CREATE TABLE IF NOT EXISTS active_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  count integer NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Create function to get database stats
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN json_build_object(
    'table_sizes', (
      SELECT json_object_agg(table_name, pg_total_relation_size(table_name::text))
      FROM information_schema.tables
      WHERE table_schema = 'public'
    ),
    'connection_count', (
      SELECT count(*) 
      FROM pg_stat_activity
    ),
    'cache_hit_ratio', (
      SELECT sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read))
      FROM pg_statio_user_tables
    )
  );
END;
$$;

-- Enable RLS
ALTER TABLE api_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to authenticated users" ON api_metrics
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users" ON active_sessions
  FOR SELECT TO authenticated USING (true);