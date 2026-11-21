# Contributing to Kin

Kin is an early-stage hackathon project. Small, focused pull requests are easiest to review.

## Setup

Use Node.js 22 or newer.

```bash
cp .env.example .env
npm install
npm run dev
```

Add local Agora and Clerk values to `.env` when testing live voice or Google sign-in. Never commit `.env` or copy real credentials into issues, screenshots, logs, or pull requests.

## Before opening a pull request

```bash
npm run lint
npm run typecheck
npm run verify:api
npm run build
```

Describe the user-visible change, the checks you ran, and any environment setup needed to reproduce it.

## Project conventions

- Keep browser-only Agora code inside client components.
- Keep Agora certificates, Murf keys, Clerk secrets, and API tokens on the server.
- Preserve the existing Agora RTC/RTM lifecycle and microphone ownership patterns.
- Ask for explicit confirmation before adding external writes or checkout actions.
- Update [BUILD_STATUS.md](BUILD_STATUS.md) when a roadmap item changes state.

## Branches and commits

Use a focused branch and a clear commit message. Keep unrelated formatting changes out of the pull request.

## License

By contributing, you agree that your contributions will be released under the [MIT License](LICENSE).
