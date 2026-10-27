import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'
import App from './App'
import { complete } from './api'

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('fetch', vi.fn(async (url: string, options?: RequestInit) => {
    const data = url.endsWith('/health') ? { status: 'ok', model: { ready: false, model: 'test-model', detail: 'Unavailable' } } : options?.method === 'POST' ? {
      id: 'test-session', personality: 'archivist', mode: JSON.parse(String(options.body)).mode,
      cwd: '/home/echo', stage: 1, clues: [], clue_details: {}, journal: '', ending: null, history: [], conversation: [], completions: ['help', 'cat'],
    } : []
    return { ok: true, status: 200, json: async () => data }
  }))
})

test('explicit demo starts with simulation and provenance labels', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByLabelText('Scripted demo'))
  await user.click(screen.getByRole('button', { name: /start investigation/i }))
  expect(await screen.findByText('SCRIPTED DEMO / NO AI')).toBeTruthy()
  expect(screen.getByLabelText('Simulated command')).toBeTruthy()
  expect(screen.getByText(/All commands are simulated/)).toBeTruthy()
})

test('effects toggle persists and supports keyboard focus', async () => {
  render(<App />)
  await userEvent.click(screen.getByRole('button', { name: 'Effects on' }))
  expect(localStorage.getItem('ghostshell-effects')).toBe('off')
  await waitFor(() => expect(screen.getByRole('button', { name: 'Effects off' }).getAttribute('aria-pressed')).toBe('false'))
})

test('completion preserves path prefix and unique candidates', () => {
  expect(complete('cat RE', ['README.txt', 'README.txt', 'help'])).toEqual(['cat README.txt'])
  expect(complete('cd /ar', ['/archive', '/home/echo'])).toEqual(['cd /archive'])
})
