# Web Feature Flags

| Flag | Default | Description |
| --- | --- | --- |
| `TAG_HUB_V1` | `false` | Enables the SORA Explorer experience at `/explore` and generates `/tag/[slug]` detail routes. When disabled, `/explore` shows a preview message and tag pages are not built. |

## Usage

- **Local development**: `TAG_HUB_V1=true pnpm dev`
- **Preview deployments**: Configure the environment variable to `true` to test SORA Explorer prior to production.
- **Production rollout**: Follow `apps/web/docs/RELEASE_SORA_EXPLORER.md` for enable/disable/rollback instructions.

When the flag is `false`, the sitemap, navigation links, Pagefind metadata, and static routes automatically exclude SORA Explorer content.


