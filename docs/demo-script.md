# Three-Minute Demo

Prepare: install dependencies, start both services, open http://localhost:5173 .
For a guaranteed model-independent recording select **Scripted demo** and explicitly
say it is prewritten. For an AI demonstration first install/start Ollama, select live
mode and verify a generated response. Live inference was not verified during development.

## Recording Outline

1. **0:00-0:25:** show title, simulation notice, personality selection and model status.
   Explain that the local model narrates but application code controls progression.
2. **0:25-1:15:** read the mission and messages. Show discovered clues, arrows/Tab,
   then solve KEEP. Mention the mnemonic's initial letters.
3. **1:15-2:10:** read consent and counts. Solve 12 + 7 + 4 = 23. Read identity and
   handoff. Explain Mara's voluntary departure and ECHO's fictional nature.
4. **2:10-3:00:** choose preserve, save a journal note, export, exit and continue.
   Show demo/live provenance. Explain that release is the alternative explicit ending.

## Shortest Complete Walkthrough (Spoilers)

Enter these commands individually from the initial directory:

```text
cat README.txt
cat notes/mission.txt
cat notes/mnemonic.txt
cat messages/last-mail.txt
inspect /archive keep
cat /archive/consent.txt
cat /archive/counts.csv
inspect /sys/ghost 23
cat /sys/ghost/identity.txt
cat /sys/ghost/handoff.txt
inspect /sys/ghost preserve
```

For the other ending, use `release` instead of `preserve` on the final command in
a fresh/reset investigation. `reset` shows confirmation instructions; `reset confirm`
clears this investigation's progress. Narrative archive/release actions never delete host files.
The story targets 10-15 minutes of exploratory play; that duration was not measured.
