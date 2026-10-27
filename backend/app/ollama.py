import httpx


class ModelError(Exception):
    pass


class Ollama:
    def __init__(self, url, model, timeout=45):
        self.url, self.model, self.timeout = url.rstrip("/"), model, timeout

    async def status(self):
        try:
            async with httpx.AsyncClient(timeout=3, trust_env=False) as client:
                response = await client.get(self.url + "/api/tags")
                response.raise_for_status()
                names = [item["name"] for item in response.json().get("models", [])]
                ready = self.model in names or self.model + ":latest" in names
                return dict(ready=ready, model=self.model, detail="Local model ready" if ready else "Configured model not installed. Pull it manually with Ollama.")
        except (httpx.HTTPError, ValueError, KeyError, TypeError):
            return dict(ready=False, model=self.model, detail="Ollama unavailable. Start Ollama, then retry status; demo remains available.")

    async def generate(self, messages):
        try:
            async with httpx.AsyncClient(timeout=self.timeout, trust_env=False) as client:
                response = await client.post(self.url + "/api/chat", json=dict(model=self.model, messages=messages, stream=False, options=dict(num_predict=150, num_ctx=4096, temperature=0.6)))
                response.raise_for_status()
                text = response.json().get("message", {}).get("content", "").strip()
                if not text:
                    raise ModelError("Local model returned an empty response.")
                return text[:1800]
        except httpx.TimeoutException as error:
            raise ModelError("Local inference timed out. Try a smaller model or increase OLLAMA_TIMEOUT.") from error
        except (httpx.HTTPError, ValueError, AttributeError, TypeError) as error:
            raise ModelError("Local inference unavailable. Start Ollama and install the configured model, then retry.") from error
