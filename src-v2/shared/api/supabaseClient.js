import { createClient } from '@supabase/supabase-js';
import { env, assertEnv } from '../config/env';

assertEnv();

export const supabaseClientV2 = createClient(env.supabaseUrl, env.supabaseAnonKey);
