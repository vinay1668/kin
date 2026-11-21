# Kin

Kin is a shared voice assistant for everyday plans. Talk with your household, turn the conversation into a clear plan, and prepare actions across connected services.

The current demo combines a real-time Agora voice room, live transcript, optional Murf Falcon speech, Google sign-in through Clerk, and a focused interface for starting a conversation quickly.

## Current scope

- Real-time browser voice conversation with Agora RTC and RTM
- Live transcript and agent status updates
- Kin family-planning prompt with interruption support
- Optional Murf Falcon TTS with a managed fallback voice
- Google sign-in through Clerk
- Responsive home and conversation screens
- Server-side token, agent start, agent stop, and Clerk session routes

Planned work includes persistent shared plans, agent tools, Google Calendar, a Chrome extension bridge, and approved browser actions. See [BUILD_STATUS.md](BUILD_STATUS.md) for the implementation checklist.

## Run locally

Requirements are Node.js 22 or newer and npm.

```bash
git clone <your-repository-url>
cd kin
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run the checks before opening a pull request.

```bash
npm run lint
npm run typecheck
npm run verify:api
npm run build
```

## Environment

Copy `.env.example` to `.env`. Keep `.env` on your machine. It is ignored by Git.

| Variable | Required | Purpose |
| --- | :---: | --- |
| `NEXT_PUBLIC_AGORA_APP_ID` | Yes | Agora project App ID used by the browser client |
| `NEXT_AGORA_APP_CERTIFICATE` | Yes | Agora server certificate used to mint tokens |
| `NEXT_MURF_API_KEY` | Optional | Enables Murf Falcon TTS |
| `NEXT_MURF_VOICE_ID` | Optional | Murf voice ID, defaults to `Matthew` |
| `CLERK_PUBLISHABLE_KEY` | Optional | Enables the Google account flow |
| `CLERK_SECRET_KEY` | Optional | Verifies Clerk sessions on the server |
| `CLERK_AUTHORIZED_PARTIES` | Optional | Allowed app origins, usually `http://localhost:3000` locally |

Agora provides managed speech recognition and language model access for the current agent configuration. Separate OpenAI or Deepgram keys are not required for the base demo.

For Google sign-in, create or select the Clerk application used by Spark, enable Google under **User & authentication → Social connections**, and copy the three Clerk values into `.env`.

Never commit certificates, API keys, Clerk secrets, or `.env` files.

## Architecture

```text
Browser
  ├─ Agora RTC microphone/audio
  ├─ Agora RTM transcript and agent events
  └─ Clerk browser session for Google sign-in

Next.js server routes
  ├─ Mint RTC + RTM tokens
  ├─ Start and stop the Agora agent
  ├─ Verify Clerk sessions
  └─ Select Murf Falcon or the managed TTS fallback

Agora Conversational AI
  └─ Speech recognition → language model → speech synthesis
```

Important implementation boundaries live in [AGENTS.md](AGENTS.md) and the structured notes under [docs/ai](docs/ai).

## Contributing

1. Fork the repository and create a focused branch.
2. Copy `.env.example` to `.env` and add local credentials.
3. Make the smallest complete change that fits the current product scope.
4. Run `npm run lint`, `npm run typecheck`, `npm run verify:api`, and `npm run build`.
5. Open a pull request with the user-visible change, test results, and any environment setup required.

Keep secrets out of source files, screenshots, logs, commits, and pull requests. Update `BUILD_STATUS.md` when a planned feature changes state.

## License

Kin is released under the [MIT License](LICENSE).
