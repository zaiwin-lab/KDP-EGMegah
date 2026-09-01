import Anthropic from '@anthropic-ai/sdk';

/* Server-side only. The key is read from the function environment and is
   never sent to, or reachable from, the browser bundle. */
export const client = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
};

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/* 501 tells the browser client to stop asking and use its local engine. */
export const notConfigured = () =>
  json({ error: 'assistant_not_configured' }, 501);

export function firstText(message: Anthropic.Message): string {
  for (const block of message.content) {
    if (block.type === 'text') return block.text;
  }
  return '';
}

/* Models sometimes wrap JSON in prose or a code fence. Pull the object out
   rather than failing the whole request. */
export function parseJsonObject<T>(text: string): T | null {
  const trimmed = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(trimmed.slice(start, end + 1)) as T;
    } catch {
      return null;
    }
  }
}

export const MODEL = 'claude-opus-5';
