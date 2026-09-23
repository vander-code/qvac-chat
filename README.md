# qvac-chat

A tiny terminal chatbot that runs **entirely on your own device** using
[Tether's QVAC SDK](https://qvac.tether.io). No cloud server, no API key, no
usage bill — the model downloads once, loads into memory locally, and every
reply is generated on your machine.

## SDK version

Built and tested with `@qvac/sdk` **0.19.0**.

## Requirements

- [Node.js](https://nodejs.org) v22.17 or newer
- npm v10.9 or newer
- A few GB of free disk space (for the model, downloaded on first run)

## Install

```bash
git clone https://github.com/YOUR-USERNAME/qvac-chat.git
cd qvac-chat
npm install
```

## Run

```bash
npm start
```

The first time you run it, the SDK downloads a small local language model
(Llama 3.2 1B, quantized) and caches it on disk. Every run after that starts
instantly from the cache.

Then just type a message and press Enter to chat. Type `exit` to quit.

```
qvac-chat — on-device AI, no cloud involved

Loading the model (first run downloads it, this can take a minute)...

Model loaded. Type a message and press Enter.
Type 'exit' to quit.

You: What is on-device AI?
AI:  On-device AI means the model runs directly on your computer or phone...
```

## How it works

1. `loadModel()` downloads (first run only) and loads a small LLM into memory
   on your device.
2. `completion()` streams a reply token-by-token, entirely from local
   inference — nothing is sent to a server.
3. `unloadModel()` frees the model from memory when you exit.

All inference happens on-device via the QVAC SDK; no cloud AI service is
involved at any point.

## License

MIT — see [LICENSE](LICENSE).
