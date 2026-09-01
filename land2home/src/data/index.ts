import type { Repository } from './repository';
import { LocalRepository } from './localRepository';
import { SupabaseRepository, supabaseConfigured } from './supabaseRepository';

let instance: Repository | null = null;

/* Supabase is used when both env vars are present; otherwise the portal
   runs on the local demonstration store. Only the anon key is ever exposed
   to the browser, and row-level security is what actually protects the
   data (see supabase/schema.sql). */
export function repository(): Repository {
  if (!instance) {
    instance = supabaseConfigured() ? new SupabaseRepository() : new LocalRepository();
  }
  return instance;
}

export function resetDemoData() {
  const repo = repository();
  if (repo instanceof LocalRepository) {
    repo.resetDemo();
    return true;
  }
  return false;
}

export { LocalRepository };
export type { Repository };
