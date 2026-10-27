import { useEffect, useRef, useState } from 'react'
import { API, api, complete, type Health, type Saved, type Session } from './api'

const ACTS = ['The abandoned machine', 'Borrowed light', 'The human checkpoint']
const PERSONAS = [
  { id: 'archivist', name: 'The Archivist', code: '01', description: 'Quiet. Melancholic. A keeper of things left behind.' },
  { id: 'trickster', name: 'The Trickster', code: '02', description: 'A little mischief in the machine. Watch the cursor.' },
  { id: 'debugger', name: 'The Debugger', code: '03', description: 'Dry humor. Unresolved errors. Unexpected company.' },
]

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [saved, setSaved] = useState<Saved[]>([])
  const [health, setHealth] = useState<Health | null>(null)
  const [personality, setPersonality] = useState('archivist')
  const [mode, setMode] = useState<'live' | 'demo'>('live')
  const [busy, setBusy] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [ghostError, setGhostError] = useState('')
  const [command, setCommand] = useState('')
  const [journal, setJournal] = useState('')
  const [journalSaved, setJournalSaved] = useState(false)
  const [effects, setEffects] = useState(() => localStorage.getItem('ghostshell-effects') !== 'off')
  const [hiddenRows, setHiddenRows] = useState(0)
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const abort = useRef<AbortController | null>(null)
  const sessionRef = useRef<Session | null>(null)

  async function refresh() {
    try {
      const [status, list] = await Promise.all([api<Health>('/health'), api<Saved[]>('/sessions')])
      setHealth(status); setSaved(list); setError('')
    } catch { setError('The machine is silent. Start the FastAPI backend on port 8000, then reconnect.') }
  }
  useEffect(() => { void refresh(); return () => abort.current?.abort() }, [])
  useEffect(() => { sessionRef.current = session }, [session])
  useEffect(() => { bottom.current?.scrollIntoView?.({ block: 'nearest' }) }, [session?.history.length, session?.conversation.length, generating])
  useEffect(() => { if (!busy) input.current?.focus() }, [busy, session?.id])

  function enter(next: Session) {
    abort.current?.abort(); setGenerating(false); setSession(next); sessionRef.current = next
    setJournal(next.journal); setJournalSaved(false); setHiddenRows(0); setGhostError(''); setError(''); setCommand('')
    localStorage.setItem('ghostshell-session', next.id)
  }
  async function start() {
    setBusy(true); setError('')
    try { enter(await api<Session>('/sessions', 'POST', { personality, mode })) }
    catch (failure) { setError((failure as Error).message) }
    finally { setBusy(false) }
  }
  async function resume(id: string) {
    setBusy(true)
    try { enter(await api<Session>(`/sessions/${id}`)) }
    catch (failure) { setError((failure as Error).message) }
    finally { setBusy(false) }
  }
  async function remove(id: string) {
    if (!window.confirm('Permanently delete this local investigation, including its notes?')) return
    try { await api(`/sessions/${id}`, 'DELETE'); await refresh() }
    catch (failure) { setError((failure as Error).message) }
  }
  async function talk(id: string) {
    abort.current?.abort()
    const controller = new AbortController(); abort.current = controller
    setGenerating(true); setGhostError('')
    try {
      const result = await api<{ session: Session }>(`/sessions/${id}/ghost`, 'POST', undefined, controller.signal)
      if (sessionRef.current?.id === id && !controller.signal.aborted) setSession(result.session)
    } catch (failure) {
      if (!controller.signal.aborted) setGhostError((failure as Error).message)
    } finally { if (abort.current === controller) setGenerating(false) }
  }
  async function run(value = command) {
    if (!session || busy || !value.trim()) return
    abort.current?.abort(); setGenerating(false); setBusy(true); setError(''); setCommand(''); setHistoryIndex(-1); setSuggestions([])
    try {
      const result = await api<{ session: Session; request_ai: boolean; clear: boolean }>(`/sessions/${session.id}/command`, 'POST', { command: value })
      setSession(result.session); sessionRef.current = result.session
      if (result.clear) setHiddenRows(result.session.history.length)
      if (value.trim() === 'reset confirm') { setJournal(''); setHiddenRows(0) }
      if (value.startsWith('journal ')) setJournal(result.session.journal)
      if (result.request_ai) void talk(session.id)
    } catch (failure) { setError((failure as Error).message); setCommand(value) }
    finally { setBusy(false) }
  }
  async function saveJournal() {
    if (!session) return
    try {
      await api(`/sessions/${session.id}/journal`, 'PUT', { text: journal })
      setSession(current => current ? { ...current, journal } : current); setJournalSaved(true); setError('')
    } catch (failure) { setError((failure as Error).message) }
  }
  async function leave() {
    if (session && journal !== session.journal && !window.confirm('Journal changes are unsaved. Leave without saving them?')) return
    abort.current?.abort(); setGenerating(false); setSession(null); sessionRef.current = null; await refresh()
  }

  const latestGhost = session?.conversation.at(-1)
  const ready = health?.model.ready
  return <div className={`app ${effects ? 'effects' : ''}`}>
    <header className="masthead">
      <button className="wordmark" onClick={() => { if (session) void leave() }} aria-label="GhostShell home"><span className="brand-mark">G<span>_</span></span> GHOSTSHELL<span className="version">/ v1.0</span></button>
      <div className="header-right"><span className="local-label"><span className="status-dot" /> LOCAL-FIRST / NO CLOUD</span><button className="text-button effects-button" aria-pressed={effects} onClick={() => { setEffects(!effects); localStorage.setItem('ghostshell-effects', effects ? 'off' : 'on') }}>Effects {effects ? 'on' : 'off'}</button></div>
    </header>

    {!session ? <main className="landing">
      <section className="hero">
        <div className="eyebrow"><span className="tiny-cross">+</span> AN INTERACTIVE TERMINAL MYSTERY</div>
        <h1>Some processes<br />never <span>die.</span><span className="hero-cursor">_</span></h1>
        <p className="hero-copy">An abandoned computer. A missing programmer.<br className="desktop-break" /> An archive that has started answering back.</p>
        <div className="hero-meta"><span>THREE ACTS</span><span>TWO ENDINGS</span><span>~ 10–15 MIN</span></div>
        <div className="archive-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="archive-window"><div className="window-bar"><span /> <span /> <span /><small>echo@workstation-07:~</small></div><div className="ascii-ghost">{'    ▄██████▄\n  ▄██░░██░░██▄\n  ██░░░░░░░░██\n  ██░░▀▀▀▀░░██\n  ██░░░░░░░░██\n  ██▄██▄██▄███'}</div><div className="art-terminal">&gt; ping the_other_side<br /><span>1 process still listening</span><br />&gt; <span className="blink">_</span></div></div><div className="art-caption"><span className="status-dot" /> SIGNAL FOUND <span>03:17:09</span></div></div>
      </section>
      <section className="setup-card" aria-labelledby="setup-title">
        <div className="card-heading"><span className="eyebrow">ESTABLISH A CONNECTION</span><span className="serial">GS—007</span></div>
        <h2 id="setup-title">Someone is still here.</h2><p className="muted intro">Choose the voice on the other side.</p>
        <fieldset className="personas"><legend className="sr-only">Ghost personality</legend>{PERSONAS.map(persona => <label className={`persona ${personality === persona.id ? 'selected' : ''}`} key={persona.id}><input type="radio" name="personality" value={persona.id} checked={personality === persona.id} onChange={() => setPersonality(persona.id)} /><span className="persona-code">{persona.code}</span><span><strong>{persona.name}</strong><small>{persona.description}</small></span><span className="radio-visual" /></label>)}</fieldset>
        <fieldset className="mode-picker"><legend>CONNECTION MODE</legend><label><input type="radio" name="mode" checked={mode === 'live'} onChange={() => setMode('live')} /> Live local AI</label><label><input type="radio" name="mode" checked={mode === 'demo'} onChange={() => setMode('demo')} /> Scripted demo</label></fieldset>
        <div className="connection"><span className={`status-dot ${ready ? '' : 'amber'}`} /><span>{ready ? 'OLLAMA CONNECTED' : 'OLLAMA NOT CONNECTED'}<small>{health?.model.model || 'Checking local connection…'}</small></span><button className="text-button" onClick={() => void refresh()} aria-label="Refresh model status">↻</button></div>
        {mode === 'live' && !ready && <p className="mode-note">Live dialogue needs the configured Ollama model. You can still explore, or choose the labeled scripted demo.</p>}
        {mode === 'demo' && <p className="mode-note">SCRIPTED DEMO: prewritten reactions. No model inference. The full mystery remains playable.</p>}
        <button className="primary" disabled={busy} onClick={() => void start()}>{busy ? 'CONNECTING…' : 'START INVESTIGATION'} <span>↗</span></button>
        {saved.length > 0 && <button className="continue" disabled={busy} onClick={() => void resume(saved.some(item => item.id === localStorage.getItem('ghostshell-session')) ? localStorage.getItem('ghostshell-session')! : saved[0].id)}>Continue saved investigation <span>↵</span></button>}
        <p className="simulation-note"><span>⌘</span> All commands run inside a fictional simulation.<br />No access to your real files. No real ghosts.</p>
      </section>
      {error && <div className="error landing-error" role="alert">{error} <button onClick={() => void refresh()}>Reconnect</button></div>}
      {saved.length > 0 && <section className="saved-section"><h2>Previous transmissions <span>{saved.length.toString().padStart(2, '0')}</span></h2><div className="saved-list">{saved.map(item => <div className="saved-item" key={item.id}><button disabled={busy} onClick={() => void resume(item.id)}><strong>{PERSONAS.find(persona => persona.id === item.personality)?.name}</strong><small>ACT {item.stage} / {item.mode === 'demo' ? 'SCRIPTED DEMO' : 'LIVE LOCAL AI'}{item.ending ? ' / COMPLETE' : ''}<br />{new Date(item.updated).toLocaleString()}</small></button><button className="delete" onClick={() => void remove(item.id)} aria-label={`Delete investigation ${item.id}`}>Delete</button></div>)}</div></section>}
    </main> : <main className="investigation">
      <div className="investigation-heading"><div><div className="eyebrow">WORKSTATION 07 / INVESTIGATION</div><h1>{ACTS[session.stage - 1]}<span className="blink">_</span></h1></div><button className="text-button" onClick={() => void leave()}>Save & exit ↗</button></div>
      <div className="game-grid"><section className="terminal-shell" aria-label="Simulated terminal">
        <div className="terminal-top"><span><span className="status-dot" /> echo@workstation-07</span><span className={`mode-badge ${session.mode === 'demo' ? 'demo' : ''}`}>{session.mode === 'demo' ? 'SCRIPTED DEMO / NO AI' : 'LIVE LOCAL AI'}</span></div>
        <div className="terminal-output" tabIndex={0} aria-label="Terminal output">
          {hiddenRows === 0 && <div className="boot"><pre>{'G H O S T S H E L L\n─────────────────'}</pre><p>Some processes never die.</p><p className="muted">Virtual filesystem mounted. All commands are simulated.<br />Start with <button className="inline-command" onClick={() => void run('cat README.txt')}>cat README.txt</button>. Type <button className="inline-command" onClick={() => void run('help')}>help</button> for commands.</p></div>}
          {session.history.slice(hiddenRows).map((row, index) => <div className="terminal-row" key={`${hiddenRows + index}-${row.command}`}><div className="command-echo"><span>echo@ghostshell</span><span> $ </span>{row.command}</div><pre>{row.output}</pre></div>)}
          <div ref={bottom} />
        </div>
        <form className="command-line" onSubmit={event => { event.preventDefault(); void run() }}><label htmlFor="command" className="prompt"><span>echo</span><span className="cwd">:{session.cwd.replace('/home/echo', '~')}</span> $</label><input id="command" ref={input} value={command} maxLength={1000} disabled={busy} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label="Simulated command" placeholder={busy ? 'Reading…' : 'Enter a command…'} onChange={event => { setCommand(event.target.value); setSuggestions([]) }} onKeyDown={event => {
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault(); const next = Math.max(-1, Math.min(session.history.length - 1, historyIndex + (event.key === 'ArrowUp' ? 1 : -1)))
            setHistoryIndex(next); setCommand(next === -1 ? '' : session.history[session.history.length - 1 - next].command)
          }
          if (event.key === 'Tab' && !event.shiftKey) {
            const matches = complete(command, session.completions)
            if (matches.length) { event.preventDefault(); if (matches.length === 1) setCommand(matches[0]); else setSuggestions(matches) }
          }
        }} /><button type="submit" disabled={busy || !command.trim()} aria-label="Execute simulated command">↵</button></form>
        {suggestions.length > 0 && <div className="suggestions" aria-live="polite">{suggestions.map(value => <button key={value} onClick={() => { setCommand(value); setSuggestions([]); input.current?.focus() }}>{value}</button>)}</div>}
        <div className="terminal-bottom"><span>↑ ↓ HISTORY <span className="divider">/</span> TAB COMPLETE</span><span>SIMULATION ONLY</span></div>
      </section>
      <button className="panel-toggle" onClick={() => setShowPanel(!showPanel)} aria-expanded={showPanel}>Investigation panel / {session.clues.length} clues {showPanel ? '−' : '+'}</button>
      <aside className={`side-panel ${showPanel ? 'expanded' : ''}`} aria-label="Investigation panel">
        <section className="ghost-card"><div className="eyebrow"><span className={`status-dot ${generating ? 'pulse' : ''}`} /> {PERSONAS.find(persona => persona.id === session.personality)?.name.toUpperCase()}</div><div aria-live="polite" className="ghost-voice">{generating ? 'Something stirs in the archive…' : latestGhost?.text || 'The cursor waits. Read something. I am listening.'}</div><small className="ghost-source">{session.mode === 'demo' ? 'SCRIPTED DEMO / PREWRITTEN TEXT' : latestGhost ? 'LOCAL MODEL / GENERATED TEXT' : 'AWAITING LOCAL MODEL / SCRIPTED PLACEHOLDER'}</small>{generating ? <button className="text-button" onClick={() => { abort.current?.abort(); setGenerating(false) }}>Stop waiting</button> : <button className="text-button" disabled={busy} onClick={() => void run('whisper hint')}>Ask for a hint ↗</button>}
          {ghostError && <div className="error" role="alert">{ghostError}<button onClick={() => void talk(session.id)}>Retry ghost</button></div>}
        </section>
        <section className="progress-card"><h2>THE INVESTIGATION <span>{session.ending ? 'COMPLETE' : `0${session.stage} / 03`}</span></h2>{ACTS.map((act, index) => <div className={`act ${index + 1 <= session.stage ? 'active' : ''}`} key={act}><span>{index + 1 < session.stage || session.ending ? '✓' : `0${index + 1}`}</span>{act}</div>)}</section>
        <section className="clue-card"><h2>COLLECTED EVIDENCE <span>{session.clues.length.toString().padStart(2, '0')} / 07</span></h2>{session.clues.length ? <ol>{session.clues.map(key => <li key={key}>{session.clue_details[key]}</li>)}</ol> : <p className="muted">Every forgotten file leaves a trace.<br />Read to collect your first clue.</p>}</section>
        <section className="journal-card"><label htmlFor="journal">FIELD NOTES <span>LOCAL JOURNAL</span></label><textarea id="journal" value={journal} maxLength={10000} placeholder="What doesn't add up?" onChange={event => { setJournal(event.target.value); setJournalSaved(false) }} /><button className="text-button" onClick={() => void saveJournal()}>{journalSaved ? 'Notes saved ✓' : 'Save notes'}</button></section>
        <div className="panel-status"><span className={`status-dot ${ready ? '' : 'amber'}`} /><span>{session.mode === 'demo' ? 'Demo / model not used' : ready ? health?.model.model : 'Model disconnected'}</span><button className="text-button" onClick={() => void refresh()} aria-label="Refresh model connection">↻</button></div>
        <a className="export" href={`${API}/api/sessions/${session.id}/export`}>Export investigation ↓</a>
      </aside></div>
      {error && <div className="error" role="alert">{error}</div>}
      {session.ending && <section className="ending-card" aria-live="polite"><div className="eyebrow">SIGNAL RESOLVED / {session.ending.toUpperCase()}</div><h2>{session.ending === 'preserve' ? 'A new keeper. Not a new ghost.' : 'Every process deserves a clean exit.'}</h2><p>The mystery is complete. Your evidence and notes remain saved.</p><button className="primary" onClick={() => void leave()}>Return to the machine ↗</button></section>}
    </main>}
    <footer><span>A FICTIONAL HAUNTING. A REAL LOCAL MODEL.</span><span>YOUR MACHINE. YOUR MYSTERY.</span></footer>
  </div>
}
