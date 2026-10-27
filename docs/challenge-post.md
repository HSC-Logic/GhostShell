# GhostShell: Some Processes Never Die

*Challenge article draft. Review before publication. Built with AI assistance.*

What if an abandoned terminal remembered the open-source projects everyone else
forgot? GhostShell turns that idea into a browser mystery. A missing programmer,
Mara, built an archive; ECHO, her software, keeps leaving messages. The ghost is
fictional software, not a claim of contact with a deceased person.

Players read original notes, mail and logs across three acts, collect seven clues,
solve two small puzzles and make an explicit final choice: preserve an opt-in
archive or release its process. The resolution explains the disappearance rather
than withholding an answer. Archivist, Trickster and Debugger personalities change
the commentary without changing what counts as evidence.

## A Model With A Bounded Role

In live mode, a local Ollama chat model receives the latest command, relevant read
files, discoveries, stage and recent dialogue. It generates short ghost reactions.
Application code, not the model, validates answers and unlocks files. Generated
text cannot run commands, write notes or change the ending. Undiscovered file
contents are excluded from the prompt. Small models can still hallucinate: prompt
instructions are guidance, not a security boundary.

An explicitly labeled scripted demo supports people without a model. Its dialogue
is prewritten and never presented as AI output. Model errors leave exploration
working and expose retry instead of secretly switching providers.

## Local Architecture And Ownership

React, TypeScript and Vite power the browser. FastAPI handles a virtual filesystem
and deterministic story engine. SQLite persists sessions. Ollama supplies local
inference over HTTP. These are open-source software components; model licensing
is separate. The example Qwen2.5 1.5B weights are Apache-2.0. Other sizes/models
need their own license review. Open weights do not imply reproducible training.

Users choose the installed model tag and keep their SQLite file and exports.
Loopback defaults keep prompts on the machine, with no telemetry or hosted AI API.
Choosing a remote Ollama URL changes that privacy boundary. Notes and exports are
not encrypted, so this is not a vault for personal secrets.

Local inference avoids a per-request hosted API bill but still consumes hardware,
electricity, disk and installation resources. Dependencies and weights must first
be installed. CPU inference can be slow; larger models require more memory.
No automatic model download or claim of benchmarked performance is included.

## What Was Tested

29 backend tests cover parsing, traversal, gated evidence, both endings, SQLite
reopening, bounded discovery context, API behavior and mocked Ollama failures.
Three frontend tests cover explicit demo labels, effects preference and completion.
Type checking and production build pass. See `testing.md` for installed versions.
Actual local-model generation, hardware benchmarks, disconnected-network operation
and real-browser desktop/mobile accessibility were not verified. The 10-15 minute
playtime is a design target, not a measured result.

The creative constraint is deliberate: let local AI add atmosphere while boring,
testable code protects the story's rules. Players own the final decision.
