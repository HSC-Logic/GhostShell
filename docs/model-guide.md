# Model Configuration

The example is Ollama `qwen2.5:1.5b`, a small instruction model available in the
Ollama library: https://ollama.com/library/qwen2.5:1.5b .
Qwen's 1.5B model license is Apache-2.0, not a claim about every Qwen size.
Check the actual model card and downloaded artifact's license before redistribution:
https://huggingface.co/Qwen/Qwen2.5-1.5B and
https://qwenlm.github.io/blog/qwen2.5/ . The 3B and 72B releases have different terms.

React, Vite, FastAPI and Ollama are open-source software. Model weights and their
licensing are a separate question: this example is an Apache-2.0 open-weight model.
That does not establish reproducibility of its original training data or training run.

Install Ollama manually, start its local server, then explicitly run
`ollama pull qwen2.5:1.5b`. The application never pulls a model.
Use `ollama list` to confirm the exact installed tag.

Edit `backend/.env`, then restart the backend:

```dotenv
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:1.5b
OLLAMA_TIMEOUT=45
FRONTEND_ORIGIN=http://localhost:5173
DATABASE_PATH=ghostshell.sqlite3
```

Change `OLLAMA_MODEL` to another installed chat-capable tag to experiment. Check its
license independently. The request uses `/api/chat`, non-streaming, 150 generated
tokens maximum, a 4096-token context setting and temperature 0.6.
Output is truncated to 1800 characters. Not every Ollama model supports identical behavior.

## Hardware Tradeoffs

The quantized 1.5B download is roughly a gigabyte; allow additional disk space and
several gigabytes of free memory for the runtime, context and operating system.
These are planning estimates, not measurements of this application. CPU-only
inference can be slow; supported GPU/Apple Silicon acceleration can help.
Larger models often improve instruction following but use more memory and time.
Increase the timeout or choose a smaller installed model if commands outpace dialogue.

Local inference avoids a per-request hosted API bill, not hardware, electricity,
storage or installation costs. No hardware benchmark or live-model performance
result is claimed here. Small models can hallucinate or ignore instructions;
their words never unlock files, award clues or decide puzzle answers.

Once dependencies and model are installed, the intended runtime has no external
network requirement. Offline operation was not verified. A remote `OLLAMA_URL`
would transmit context there; preserve the loopback default for local privacy.
