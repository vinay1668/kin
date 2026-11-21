# Kin build status

Updated: 18 November 2026

## Build order

1. [x] Lock the MVP and safety boundary in the project planning notes.
2. [x] Base the voice path on Agora's official Next.js Conversational AI starter.
3. [x] Install the Next.js, Agora RTC/RTM, Agent SDK, and UI dependencies.
4. [x] Replace the starter UI with Kin's responsive product experience.
5. [x] Configure the Kin family-assistant prompt and optional Murf Falcon TTS path.
6. [x] Add the account UI and Clerk Google sign-in session exchange.
7. [ ] Add persistent room, plan, shopping-list, and activity state.
8. [ ] Add agent tools for reading and changing the shared plan.
9. [ ] Build the Chrome extension bridge and one supported-site adapter.
10. [ ] Add explicit confirmation before calendar writes and checkout handoff.
11. [ ] Connect Google Calendar OAuth and event creation.
12. [ ] Add Agora and Murf credentials, then prove one real voice session.
13. [ ] Test the full demo on two devices and rehearse the fallback flow.
14. [ ] Deploy the web app and package the Chrome extension.

Legend: `[x]` done, `[~]` in progress, `[ ]` pending.

## Current checkpoint

The polished landing and live-conversation workspaces are implemented. Google account UI and Clerk session exchange are wired using the Spark environment contract. The repository uses Agora's supported RTC + RTM token flow, agent lifecycle, live transcript pipeline, and microphone ownership rules. Typecheck, lint, API contract checks, and the production build pass. A real conversation requires the environment values in `.env`.

## Credentials still needed

- `NEXT_PUBLIC_AGORA_APP_ID`
- `NEXT_AGORA_APP_CERTIFICATE`
- `NEXT_MURF_API_KEY`
- Optional `NEXT_MURF_VOICE_ID` (defaults to `Matthew`)
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_AUTHORIZED_PARTIES` (defaults to `http://localhost:3000` in the template)

Keep the certificate and Murf key server-side. Do not prefix either with `NEXT_PUBLIC_`.
