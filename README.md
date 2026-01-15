# 🌟 Soranauts
[![Redirects Guard](https://github.com/soranauts/soranauts/actions/workflows/redirects-guard.yml/badge.svg)](https://github.com/soranauts/soranauts/actions/workflows/redirects-guard.yml)

🚀 _Your gateway to the SORA ecosystem and DeFi innovation_. 🚀

**Soranauts** is a comprehensive content platform built with **[Astro 5.16](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/)** that provides expert analysis, guides, and insights into the SORA blockchain ecosystem, DeFi protocols, and the future of decentralized finance.

- ✅ **Production-ready** scores in **PageSpeed Insights** reports.
- ✅ **SORA-focused content** covering XOR, VAL, PSWAP tokens and ecosystem developments.
- ✅ **Fast and SEO friendly blog** with automatic **RSS feed**, **MDX** support, **Categories & Tags**, **Social Share**.
- ✅ **Image Optimization** (using new **Astro Assets** and **Unpic** for Universal image CDN).
- ✅ **DeFi & Blockchain guides** for traders, developers, and crypto enthusiasts.
- ✅ **Open Graph tags** for social media sharing and **structured data** for search engines.
- ✅ **Analytics** built-in Google Analytics, and Splitbee integration.

<br>

[![SORA Ecosystem](https://img.shields.io/badge/ecosystem-SORA-ff6b35?style=flat-square&logo=polkadot&logoColor=white&labelColor=000000)](https://sora.org)
[![License](https://img.shields.io/github/license/soranauts/soranauts?style=flat-square&color=dddddd&labelColor=000000)](https://github.com/soranauts/soranauts/blob/main/LICENSE.md)
[![Maintained](https://img.shields.io/badge/maintained%3F-yes-brightgreen.svg?style=flat-square)](https://github.com/soranauts)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)](https://github.com/soranauts/soranauts#contributing)
[![Website](https://img.shields.io/badge/website-soranauts.com-00d4aa?style=flat-square)](https://soranauts.com)
[![SEO Optimized](https://img.shields.io/badge/SEO-optimized-green?style=flat-square)](https://soranauts.com)

<br>

<details open>
<summary>Table of Contents</summary>

- [Live Website](#live-website)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
  - [Project structure](#project-structure)
  - [Commands](#commands)
  - [Configuration](#configuration)
  - [Knowledge Base](#knowledge-base)
  - [Deploy](#deploy)
- [Content Focus](#content-focus)
- [Recent Updates](#recent-updates)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)

</details>

<br>

## Live Website

🌐 [https://soranauts.com](https://soranauts.com)

Soranauts provides comprehensive coverage of the SORA ecosystem, including:
- **SORA v3 updates** and blockchain innovations
- **Polkaswap DEX** guides and trading strategies  
- **Token analysis** for XOR, VAL, and PSWAP
- **DeFi protocols** and investment strategies
- **Blockchain technology** comparisons and guides

<br>

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20.x** — [Download](https://nodejs.org/)
- **pnpm 9.x** — Install with `npm install -g pnpm`

<br>

## Getting started

**Soranauts** is built using [Astro 5.16](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/) for optimal performance and SEO. The platform focuses on delivering high-quality content about the SORA ecosystem with a clean, fast-loading interface.

The site uses minimal JavaScript for core functionality while maintaining excellent performance scores and SEO optimization for maximum discoverability of SORA-related content.

### Project structure

**Soranauts** is organized as a pnpm monorepo with the following structure:

```
/
├── apps/
│   └── web/                    # Main Astro web application
│       ├── src/
│       │   ├── components/
│       │   │   ├── glossary/   # Interactive glossary components
│       │   │   ├── tools/      # React islands for tools
│       │   │   ├── blog/
│       │   │   ├── common/
│       │   │   ├── ui/
│       │   │   └── widgets/
│       │   ├── content/
│       │   │   ├── post/       # Blog articles (MDX)
│       │   │   └── glossary/   # Glossary terms (MDX)
│       │   ├── data/
│       │   │   └── taxonomy.ts # Master glossary definitions
│       │   ├── pages/
│       │   │   ├── glossary/
│       │   │   ├── tools/
│       │   │   └── api/
│       │   └── types/
│       ├── public/
│       │   └── data/
│       │       └── glossary.v2025.json
│       └── package.json
├── packages/
│   ├── chain/                  # Blockchain facade
│   ├── config/                 # Shared configurations
│   └── ui/                     # Shared UI components
├── knowledge_base/             # RAG knowledge base system
├── scripts/                    # Build and utility scripts
├── package.json                # Root package.json
├── pnpm-workspace.yaml
└── README.md
```

**Key Features:**
- **Monorepo Architecture**: Shared packages for chain interactions, configurations, and UI components
- **React Islands**: Interactive components using Astro's React integration
- **Glossary System**: 370 terms with Pagefind search and category filtering
- **API Endpoints**: Rate-limited endpoints for blockchain interactions

<br>

### Commands

All commands are run from the root of the project, from a terminal:

| Command | Action |
| :------ | :----- |
| `pnpm install` | Install dependencies for the entire monorepo |
| `pnpm dev` | Start local dev server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` (includes Pagefind search index) |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm typecheck` | Run TypeScript checks across all packages |

**Content & Glossary:**

| Command | Action |
| :------ | :----- |
| `pnpm glossary:build` | Build glossary JSON from taxonomy |
| `pnpm glossary:verify` | Verify glossary build parity |
| `pnpm content:lint` | Lint MDX content files |
| `pnpm content:validate` | Validate frontmatter |
| `pnpm taxonomy:audit` | Audit glossary taxonomy |

**Knowledge Base:**

| Command | Action |
| :------ | :----- |
| `pnpm kb:ingest` | Ingest content into knowledge base |
| `pnpm kb:ingest:local` | Ingest using local DuckDB store |

**Deployment:**

| Command | Action |
| :------ | :----- |
| `pnpm deploy:prod` | Build and deploy to production |
| `pnpm verify:live` | Verify live site glossary |

<br>

### Configuration

Basic configuration file: `./apps/web/src/config.yaml`

For detailed configuration options, see the [Astro documentation](https://docs.astro.build/).

<br>

### Knowledge Base

Soranauts includes an advanced RAG (Retrieval-Augmented Generation) knowledge base system that powers content discovery and intelligent search features.

**Key Features:**
- **Multi-source ingestion**: Automatically syncs content from Medium, SORA Wiki, GitHub, and other sources
- **Semantic search**: ChromaDB-powered vector search for intelligent content retrieval
- **Quality testing**: Built-in backtesting to ensure retrieval accuracy
- **Automated workflows**: GitHub Actions for continuous knowledge base updates

For detailed documentation, see [knowledge_base/README.md](./knowledge_base/README.md).

**Pagefind Search:**

The site uses [Pagefind](https://pagefind.app/) for static search functionality. The search index is automatically built during `pnpm build` and requires no additional configuration. The index includes all blog posts, glossary terms, and documentation pages.

<br>

### Deploy

#### Deploy to production (manual)

You can create an optimized production build with:

```shell
pnpm build
```

Now, your website is ready to be deployed. All generated files are located at
`apps/web/dist` folder, which you can deploy to any hosting service you prefer.

#### Deploy to Vercel

Soranauts is configured for Vercel deployment. Connect your GitHub repository to Vercel for automatic deployments on push.

<br>

## Content Focus

Soranauts specializes in comprehensive coverage of:

### 🚀 SORA Ecosystem
- **SORA v3** blockchain innovations and updates
- **Polkaswap DEX** features and trading strategies
- **Token analysis** for XOR, VAL, and PSWAP
- **Governance** and decentralized decision-making

### 💰 DeFi & Trading
- **Decentralized exchanges** comparison and guides
- **Investment strategies** for crypto portfolios
- **Market analysis** and price predictions
- **Risk management** and security best practices

### 📚 Interactive Glossary
- **370 SORA ecosystem terms** with comprehensive definitions
- **Pagefind-powered search** with instant results
- **18 categories**: Accounts & Identity, Consensus, Cryptography, Data Availability, DeFi, Developer Experience, Economics, Ecosystem, Execution, Governance, Network, Networking, Observability & Operations, Serialization & Encoding, Storage, Technology, Token, Use Cases
- **Auto-linking** in blog posts with tooltips
- **Deep linking** support for direct term access

### 🔗 Blockchain Technology
- **Polkadot ecosystem** and parachain technology
- **Consensus mechanisms** (Proof of Stake vs Proof of Work)
- **Smart contracts** and development guides
- **Cross-chain interoperability**

## Recent Updates

### 🔧 Technical Improvements (Latest)
- ✅ **Interactive Glossary** - 370 terms with Pagefind search and category filtering
- ✅ **React Islands Architecture** - Implemented Astro React islands for interactive components
- ✅ **Monorepo Structure** - Migrated to pnpm monorepo with shared packages and configurations
- ✅ **API Endpoints** - Added rate-limited quote API with proper error handling
- ✅ **Fixed canonical URL bug** - Resolved incorrect canonical URL generation that was causing SEO issues
- ✅ **Fixed breadcrumb schema** - Corrected structured data for better search engine understanding
- ✅ **Enhanced mobile menu** - Improved spacing and indentation for better user experience
- ✅ **SEO optimization** - Added proper robots meta tags and pagination handling

### 📝 Content Updates
- ✅ **45 articles** covering SORA ecosystem and DeFi topics
- ✅ **Chronological update checklist** for maintaining content freshness
- ✅ **Category organization** for better content discovery
- ✅ **Social media integration** for content sharing

<br>

## Glossary v2025 Overview

- [Phase chronology & notes](docs/glossary-v2025.md)
- [Phase 14 release checklist](docs/release/glossary-v2025-phase14.md)
- [Feature flag reference](docs/glossary/FEATURE_FLAGS.md)

## Related Projects

- [SORA Network](https://sora.org) - The official SORA blockchain network
- [Polkaswap](https://polkaswap.io) - Decentralized exchange on SORA
- [SORA Wiki](https://wiki.sora.org) - Comprehensive SORA ecosystem documentation

## Contributing

We welcome contributions to improve Soranauts! Whether you want to:

- 📝 **Write content** about SORA ecosystem developments
- 🐛 **Report bugs** or suggest improvements
- 🔧 **Fix technical issues** or enhance functionality
- 📊 **Improve SEO** or performance
- 🎨 **Enhance design** or user experience

Please feel free to open a discussion, create an issue, or submit a pull request. Your contributions help make Soranauts the go-to resource for SORA ecosystem information.

## Acknowledgements

Soranauts was originally built on the [AstroWind](https://github.com/onwidget/astrowind) template and has since evolved into a comprehensive SORA ecosystem resource. Special thanks to the SORA ecosystem team for their innovative blockchain technology and the contributors who help make this platform a valuable resource for the community.

## License

**Soranauts** is licensed under the MIT license — see the [LICENSE](./LICENSE.md) file for details.
