
import { run } from '@/cron/newsFetch';
export const revalidate = 0;
export async function GET(){ await run(); return new Response('OK'); }
