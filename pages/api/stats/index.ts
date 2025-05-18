import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get database stats
    const { data: dbStats, error: dbError } = await supabase
      .rpc('get_database_stats');

    if (dbError) throw dbError;

    // Get API response times
    const { data: apiStats, error: apiError } = await supabase
      .from('api_metrics')
      .select('endpoint, avg_response_time, p95_response_time, error_rate')
      .order('avg_response_time', { ascending: false });

    if (apiError) throw apiError;

    // Get concurrent users
    const { data: userStats, error: userError } = await supabase
      .from('active_sessions')
      .select('count')
      .single();

    if (userError) throw userError;

    return res.status(200).json({
      database: dbStats,
      api: apiStats,
      users: userStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}