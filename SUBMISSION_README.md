# GhostShell: Some Processes Never Die

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26).*

## What I Built

GhostShell is a local-first haunted terminal mystery. You open an abandoned machine, explore its files, and discover that something inside still has unfinished business.

That something is ECHO: fictional software left behind by a missing programmer named Mara. Through notes, messages, and system logs, you uncover what happened and decide what should survive.

The game has three acts, seven clues, two puzzles, and two explicit endings. You can choose between three ghost personalities: the quiet Archivist, the mischievous Trickster, and the dry-humored Debugger. In live mode, a local AI model reacts to your investigation in that personality.

I interpreted “Ghost in the Machine” as the traces people leave in software: unfinished work, forgotten projects, and messages that outlive their original context. The terminal is fictional, so every command stays inside the game's virtual filesystem.

## Demo

[Watch or download the GhostShell demo (MP4)](https://github.com/HSC-Logic/GhostShell/blob/main/video/exports/ghostshell-demo.mp4) — 80 seconds, 1280 × 720, 30 fps. This silent animated walkthrough shows story excerpts, the ending choices, and why local, open AI matters.

GhostShell runs locally in your browser at `http://localhost:5173` after starting the frontend and backend. Setup instructions are in the [project README](https://github.com/HSC-Logic/GhostShell#readme).

Choose **Scripted demo** to explore without installing a model. This mode uses clearly labeled, prewritten dialogue. To experience AI-generated ghost reactions, install Ollama and the configured model, then choose live mode.

The [three-minute demo guide](https://github.com/HSC-Logic/GhostShell/blob/main/docs/demo-script.md) includes a recording outline and a complete walkthrough with spoilers.

The [Remotion video source](https://github.com/HSC-Logic/GhostShell/tree/main/video) includes an editable preview and export instructions. The video uses scripted terminal excerpts; it is not a recording of live model inference. The playable application runs locally; the MP4 above is the public demo.

## Code

[GitHub repository: HSC-Logic/GhostShell](https://github.com/HSC-Logic/GhostShell)

The repository contains the React frontend, Python backend, original story, tests, and setup documentation.

## How I Built It

The interface uses React, TypeScript, and Vite. A FastAPI backend manages the simulated filesystem, puzzle rules, and story progression. SQLite stores investigations, discovered clues, dialogue, and journal notes locally.

For AI dialogue, GhostShell integrates with **Ollama**, with **Qwen2.5 1.5B** as the example model. The [Qwen2.5 1.5B model card](https://huggingface.co/Qwen/Qwen2.5-1.5B) is linked in the project's model guide for license review. The model is installed explicitly by the player; the application never downloads weights automatically.

The model receives the current command, discovered evidence, recently read files, story stage, and a limited conversation history. It supplies the ghost's voice. Application code validates puzzle answers, awards clues, and controls the ending. This lets generated dialogue add atmosphere while keeping the mystery consistent and testable.

Commands are saved before inference begins. If Ollama is unavailable, exploration still works and the player can retry dialogue separately. There is no silent switch to a hosted provider.

The current local checks pass: **29 backend tests, 3 frontend tests, and the TypeScript/Vite production build**. The tests include both endings, persistence, and mocked model failures. Live model generation and operation with networking disconnected still need verification.

## Why Does Open Innovation Matter?

GhostShell is about whether software and the stories inside it can survive being left behind. Depending entirely on a hosted AI service would make that question uncomfortably literal: if the provider disappeared, changed access, or stopped serving a model, part of the experience could disappear with it.

Ollama and an open-weight model let the player keep the runtime on their own machine. They can retain an installed model, choose another compatible model, and change the ghost's behavior through the project's prompts. The voice of ECHO does not have to depend on one company's account system or continued API access.

Local inference also fits the intimacy of an investigation. With the default loopback configuration, the evidence sent to the model and the player's dialogue stay on the machine. Sessions and journal notes live in a local SQLite database, with JSON export available. There is no hosted AI API or telemetry in the application. These files are not encrypted, but the player controls where they are stored.

After dependencies and model weights are installed, the architecture has no external network requirement. That makes playing without an internet connection a practical design goal, although I have not yet verified it with networking disconnected. It still needs a powered computer and enough resources to run the model; local inference removes per-request API charges, not hardware or electricity costs.

This is where the open approach serves the project better than a closed API: it gives players control over the model, keeps the default inference path local, and reduces dependence on a service staying available. Those are part of the experience itself. A story about preserving software should give its players a way to preserve it.

## The Spirit of It

The emotional question behind GhostShell is simple: when a process has finished its work, do you keep it running because you can, or let it go?

The final choice is between preserving an opt-in archive and releasing its process. I wanted the haunting to lead somewhere beyond a jump scare: toward a decision about memory, consent, and what it means to care for something someone else built.

ECHO is fictional software, not a simulation of a real deceased person. Its unfinished business belongs to an original story, and the final decision belongs to the player.
