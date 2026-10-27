export type HistoryRow = { command: string; output: string }
export type Session = {
  id: string; personality: string; mode: 'live' | 'demo'; cwd: string; stage: number;
  clues: string[]; clue_details: Record<string, string>; journal: string; ending: string | null;
  history: HistoryRow[]; completions: string[];
  conversation: { command: string; text: string; source: string }[];
}
export type Saved = Pick<Session, 'id' | 'personality' | 'stage' | 'mode' | 'ending'> & { updated: string }
export type Health = { status: string; model: { ready: boolean; model: string; detail: string } }
export const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export async function api<T>(path: string, method = 'GET', body?: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(API + '/api' + path, {
    method, headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body), signal,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(typeof error?.detail === 'string' ? error.detail : `Request failed (${response.status}). Check the backend and input.`)
  }
  return response.status === 204 ? undefined as T : response.json()
}

export function complete(input: string, choices: string[]): string[] {
  const words = input.split(' ')
  const prefix = words.pop() || ''
  return [...new Set(choices.filter(choice => choice.startsWith(prefix)))].sort().map(choice => [...words, choice].join(' '))
}
