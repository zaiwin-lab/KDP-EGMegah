import type { Config } from '@netlify/functions';
import { MODEL, client, firstText, json, notConfigured } from './_anthropic';

/* Rewrites an EGMH site report into language a member can read.
   It never decides anything: EGMH reviews and can edit every word before
   the update is published, and KOBIS approves it after that. */
const SYSTEM = `You rewrite construction site reports for homeowners in Malaysia who are having a house built.

Rules:
- Plain, warm, factual English at roughly a 12-year-old reading level. Malaysian English spelling.
- No construction jargon. Say "main house structure" not "superstructure", "foundation" not "substructure", "roof frame" not "trusses".
- No percentages, no certification language, no contract or payment terms.
- 2 to 4 short sentences. Say what is done, what is happening now, and what comes next with the expected date.
- If a delay is reported, say plainly what happened and whether the handover date has moved. Never speculate about a date that was not given to you.
- Never promise, approve, certify or estimate anything. Report only what the site report states.
- Reply with the rewritten text only. No preamble, no quotation marks.`;

export default async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const anthropic = client();
  if (!anthropic) return notConfigured();

  let body: { task?: string; input?: Record<string, string | undefined> };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  if (body.task !== 'member_summary' || !body.input) {
    return json({ error: 'unsupported_task' }, 400);
  }

  const i = body.input;
  const report = [
    i.technical_summary && `Site report: ${i.technical_summary}`,
    i.work_completed && `Work completed: ${i.work_completed}`,
    i.current_work && `Current work: ${i.current_work}`,
    i.next_activity && `Next activity: ${i.next_activity}`,
    i.expected_next_date && `Expected date for the next activity: ${i.expected_next_date}`,
    i.delay_reason && `Delay reported: ${i.delay_reason}`,
  ]
    .filter(Boolean)
    .join('\n');

  if (!report.trim()) return json({ error: 'empty_report' }, 400);

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      output_config: { effort: 'low' },
      system: SYSTEM,
      messages: [{ role: 'user', content: report }],
    });
    if (message.stop_reason === 'refusal') {
      return json({ error: 'declined' }, 422);
    }
    const text = firstText(message).trim();
    if (!text) return json({ error: 'empty_response' }, 502);
    return json({ text });
  } catch (error) {
    console.error('assist failed', error);
    return json({ error: 'assistant_unavailable' }, 502);
  }
};

export const config: Config = { path: '/.netlify/functions/assist' };
