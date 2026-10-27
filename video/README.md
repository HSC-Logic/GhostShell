# GhostShell submission video

An editable 80-second, 1280 x 720, 30 fps Remotion composition. This is a silent animated explainer with terminal excerpts, not a screen recording or proof of live AI inference.

[Watch or download the exported MP4](https://github.com/HSC-Logic/GhostShell/blob/main/video/exports/ghostshell-demo.mp4).

## Preview

```powershell
cd video
npm ci
npx remotion studio --no-open
```

Open the URL printed by Studio and select **GhostShell**. Each scene also has its own composition for editing.

## Export when ready

Use Studio's Render button, or run:

```powershell
npx remotion render GhostShell out/ghostshell-demo.mp4
```

## Timeline

| Time | Scene |
| --- | --- |
| 0:00-0:10 | Opening |
| 0:10-0:26 | Mission and mnemonic excerpts |
| 0:26-0:40 | Archive checkpoint and counts |
| 0:40-0:52 | Preserve or release |
| 0:52-1:10 | Open innovation, local inference, ownership |
| 1:10-1:20 | Repository and getting started |

The terminal sequence is condensed and skips prerequisite reads. Story text comes from backend/app/story.py, with excerpts reformatted for video. The archive-unlock response comes from backend/app/engine.py. No generated dialogue, live inference, or disconnected-network test is represented as verified.

Run npm run lint for ESLint and TypeScript checks. All animation uses Remotion frames. No remote media, fonts, stock assets, or external audio services are required by the composition.
