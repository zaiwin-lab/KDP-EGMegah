import type { DocumentKind, ExtractedField, LandParcel, MemberProfile } from '@/lib/types';
import { extractFields, simplifyTechnical } from './localAssistant';

/* The browser never holds an API key. These helpers call the serverless
   functions in netlify/functions/, which read ANTHROPIC_API_KEY from the
   server environment. If the function is not deployed (local `vite dev`,
   or no key configured), everything falls back to the local engine so the
   portal keeps working. */

const FUNCTION_BASE = '/.netlify/functions';
const TIMEOUT_MS = 12000;

let serverAvailable: boolean | null = null;

async function callFunction<T>(name: string, body: unknown): Promise<T | null> {
  if (serverAvailable === false) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${FUNCTION_BASE}/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (res.status === 404 || res.status === 501) {
      serverAvailable = false;
      return null;
    }
    if (!res.ok) return null;
    serverAvailable = true;
    return (await res.json()) as T;
  } catch {
    /* Offline, aborted, or no function host. The caller falls back. */
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export interface ExtractionResult {
  fields: ExtractedField[];
  notes: string[];
  source: 'assisted' | 'local';
}

export async function extractFromDocument(args: {
  kind: DocumentKind;
  fileName: string;
  profile: MemberProfile | null;
  land: LandParcel | null;
}): Promise<ExtractionResult> {
  const remote = await callFunction<{ fields: ExtractedField[]; notes: string[] }>('extract-document', {
    kind: args.kind,
    fileName: args.fileName,
    known: {
      full_name: args.profile?.full_name,
      ic_number: args.profile?.ic_number,
      membership_no: args.profile?.membership_no,
      title_no: args.land?.title_no,
      lot_no: args.land?.lot_no,
    },
  });
  if (remote?.fields) {
    return { fields: remote.fields, notes: remote.notes ?? [], source: 'assisted' };
  }
  const local = extractFields(args.kind, args.fileName, args.profile, args.land);
  return { ...local, source: 'local' };
}

export async function draftMemberSummary(input: {
  technical_summary: string;
  work_completed: string;
  current_work: string;
  next_activity: string;
  expected_next_date: string;
  delay_reason?: string;
}): Promise<{ text: string; source: 'assisted' | 'local' }> {
  const remote = await callFunction<{ text: string }>('assist', {
    task: 'member_summary',
    input,
  });
  if (remote?.text) return { text: remote.text, source: 'assisted' };
  return { text: simplifyTechnical(input), source: 'local' };
}

export const assistantMode = () => (serverAvailable ? 'assisted' : 'local');
