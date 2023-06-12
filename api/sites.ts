import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
  regions: ['fra1'],  // fra1 = Frankfurt: pick the Vercel region nearest your Neon DB
};

export default async (req: Request, ctx: any) => {
  const longitude = parseFloat(req.headers.get('x-vercel-ip-longitude') ?? '-122.47');
  const latitude = parseFloat(req.headers.get('x-vercel-ip-latitude') ?? '37.81');

  const sites = await neon(process.env.DATABASE_URL!)`
    SELECT 
      id_no, name_en, category,
      'https://whc.unesco.org/en/list/' || id_no || '/' AS link,
      location <-> st_makepoint(${longitude}, ${latitude}) AS distance
    FROM whc_sites_2021
    ORDER BY distance
    LIMIT 10`;

  return new Response(JSON.stringify({ longitude, latitude, sites }, null, 2));
}
