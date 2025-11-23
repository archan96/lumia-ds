# Storybook – Lumia Components

How to run Storybook for `@lumia/components` locally.

## Prerequisites
- Node 18+
- pnpm (`corepack enable` recommended)
- The repo checked out; run `pnpm install` at least once from the root.

## Start Storybook (dev)
From repo root:
```bash
HOME=$(pwd) STORYBOOK_DISABLE_TELEMETRY=1 pnpm --filter @lumia/components storybook -- -p 6006
```

Notes:
- The script injects `.storybook/disable-pnp.js` via `NODE_OPTIONS` to avoid conflicts with any global `.pnp.cjs`.
- Pick another port if 6006 is busy: replace `-p 6006` with something free (e.g., `-p 6007`).

## Build Storybook (static)
```bash
HOME=$(pwd) STORYBOOK_DISABLE_TELEMETRY=1 pnpm --filter @lumia/components storybook:build
```
Output lands at `packages/components/storybook-static/`.

## Troubleshooting
- **React is not defined**: ensure you’re using the provided scripts (they configure Babel for the automatic JSX runtime).
- **PnP errors**: a global `~/.pnp.cjs` can confuse Storybook. The `disable-pnp` shim is applied automatically by the scripts; if issues persist, temporarily move/rename `~/.pnp.cjs` while running Storybook.
- **Port in use**: change the `-p` flag.
