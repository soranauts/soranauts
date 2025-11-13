# 🌟 Soranauts

<img src="https://raw.githubusercontent.com/onwidget/.github/main/resources/astrowind/lighthouse-score.png" align="right"
     alt="Soranauts Lighthouse Score" width="100" height="358">

🚀 _Your gateway to the SORA ecosystem and DeFi innovation_. 🚀

**Soranauts** is a comprehensive content platform built with **[Astro 5.15.3](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/)** that provides expert analysis, guides, and insights into the SORA blockchain ecosystem, DeFi protocols, and the future of decentralized finance.

- ✅ **Production-ready** scores in **PageSpeed Insights** reports.
- ✅ **SORA-focused content** covering XOR, VAL, PSWAP tokens and ecosystem developments.
- ✅ **Fast and SEO friendly blog** with automatic **RSS feed**, **MDX** support, **Categories & Tags**, **Social Share**.
- ✅ **Image Optimization** (using new **Astro Assets** and **Unpic** for Universal image CDN).
- ✅ **DeFi & Blockchain guides** for traders, developers, and crypto enthusiasts.
- ✅ **Open Graph tags** for social media sharing and **structured data** for search engines.
- ✅ **Analytics** built-in Google Analytics, and Splitbee integration.

<br>

<img src="./src/assets/images/soranauts-website-preview.jpg" alt="Soranauts Website Preview" width="800" height="auto">

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

## Getting started

**Soranauts** is built using [Astro 5.15.3](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/) for optimal performance and SEO. The platform focuses on delivering high-quality content about the SORA ecosystem with a clean, fast-loading interface.

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
│       │   ├── pages/
│       │   │   ├── glossary.astro
│       │   │   ├── tools/
│       │   │   └── api/
│       │   ├── data/
│       │   │   └── sora-glossary.ts
│       │   ├── scripts/
│       │   │   ├── generate-glossary-fixed.js
│       │   │   └── indexGlossary.ts
│       │   └── types/
│       │       └── glossary.ts
│       ├── public/
│       │   └── glossary.json
│       └── package.json
├── packages/
│   ├── chain/                  # Blockchain facade
│   ├── config/                 # Shared configurations
│   └── ui/                     # Shared UI components
├── package.json                # Root package.json
├── pnpm-workspace.yaml
└── README.md
```

**Key Features:**
- **Monorepo Architecture**: Shared packages for chain interactions, configurations, and UI components
- **React Islands**: Interactive components using Astro's React integration
- **Glossary System**: Searchable database with Typesense integration and fallback search
- **API Endpoints**: Rate-limited endpoints for blockchain interactions


[![Edit AstroWind on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://githubbox.com/onwidget/astrowind/tree/main)  [![Open in Gitpod](https://svgshare.com/i/xdi.svg)](https://gitpod.io/?on=gitpod#https://github.com/onwidget/astrowind)  [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/onwidget/astrowind)   

> 🧑‍🚀 **Seasoned astronaut?** Delete this file `README.md`. Update `src/config.yaml` and contents. Have fun!

<br>

### Commands

All commands are run from the root of the project, from a terminal:

| Command               | Action                                             |
| :-------------------- | :------------------------------------------------- |
| `pnpm install`        | Installs dependencies for the entire monorepo     |
| `pnpm dev`            | Starts local dev server at `localhost:4321`       |
| `pnpm build`          | Build your production site to `./dist/` (includes Pagefind search index) |
| `pnpm preview`        | Preview your build locally, before deploying       |
| `pnpm lint`           | Run ESLint across all packages                     |
| `pnpm typecheck`      | Run TypeScript checks across all packages          |
| `pnpm verify:og`      | Validate Open Graph images for all content         |
| `pnpm kb:sync:*`      | Sync content from external sources (medium, wiki, etc.) |
| `pnpm kb:backtest`    | Run knowledge base retrieval tests                 |

<br>

### Configuration

Basic configuration file: `./src/config.yaml`

```yaml
site:
  name: 'Example'
  site: 'https://example.com'
  base: '/' # Change this if you need to deploy to Github Pages, for example
  trailingSlash: false # Generate permalinks with or without "/" at the end

  googleSiteVerificationId: false # Or some value,

# Default SEO metadata
metadata:
  title:
    default: 'Example'
    template: '%s — Example'
  description: 'This is the default meta description of Example website'
  robots:
    index: true
    follow: true
  openGraph:
    site_name: 'Example'
    images:
      - url: '~/assets/images/default.jpg'
        width: 1200
        height: 628
    type: website
  twitter:
    handle: '@twitter_user'
    site: '@twitter_user'
    cardType: summary_large_image

i18n:
  language: en
  textDirection: ltr

apps:
  blog:
    isEnabled: true
    postsPerPage: 6

    post:
      isEnabled: true
      permalink: '/blog/%slug%' # Variables: %slug%, %year%, %month%, %day%, %hour%, %minute%, %second%, %category%
      robots:
        index: true

    list:
      isEnabled: true
      pathname: 'blog' # Blog main path, you can change this to "articles" (/articles)
      robots:
        index: true

    category:
      isEnabled: true
      pathname: 'category' # Category main path /category/some-category, you can change this to "group" (/group/some-category)
      robots:
        index: true

    tag:
      isEnabled: true
      pathname: 'tag' # Tag main path /tag/some-tag, you can change this to "topics" (/topics/some-category)
      robots:
        index: false

analytics:
  vendors:
    googleAnalytics:
      id: null # or "G-XXXXXXXXXX"

ui:
  theme: 'system' # Values: "system" | "light" | "dark" | "light:only" | "dark:only"
```

<br>

### Knowledge Base

Soranauts includes an advanced RAG (Retrieval-Augmented Generation) knowledge base system that powers content discovery and intelligent search features.

**Key Features:**
- **Multi-source ingestion**: Automatically syncs content from Medium, SORA Wiki, GitHub, and other sources
- **Semantic search**: ChromaDB-powered vector search for intelligent content retrieval
- **Quality testing**: Built-in backtesting to ensure retrieval accuracy
- **Automated workflows**: GitHub Actions for continuous knowledge base updates

**Common Commands:**
- `pnpm kb:sync:medium` — Sync articles from Medium publications
- `pnpm kb:sync:wiki` — Import SORA Wiki documentation
- `pnpm kb:sync:fearless:github` — Sync Fearless Wallet docs from GitHub
- `pnpm kb:backtest` — Run retrieval quality tests
- `pnpm kb:verify` — Self-test the knowledge base system

For detailed documentation, see [knowledge_base/README.md](./knowledge_base/README.md).

**Pagefind Search:**

The site uses [Pagefind](https://pagefind.app/) for static search functionality. The search index is automatically built during `pnpm build` and requires no additional configuration. The index includes all blog posts, glossary terms, and documentation pages.

<br>

### Deploy

#### Deploy to production (manual)

You can create an optimized production build with:

```shell
npm run build
```

Now, your website is ready to be deployed. All generated files are located at
`dist` folder, which you can deploy the folder to any hosting service you
prefer.

#### Deploy to Netlify

Clone this repository on own GitHub account and deploy to Netlify:

[![Netlify Deploy button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/onwidget/astrowind)

#### Deploy to Vercel

Clone this repository on own GitHub account and deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fonwidget%2Fastrowind)

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
- **Searchable database** of 100+ SORA ecosystem terms
- **Advanced search** with Typesense integration and fallback options
- **Category filtering** (Tokens, Technology, Governance, DeFi, Network, Economics)
- **Auto-linking** in blog posts with tooltips
- **Deep linking** support for direct term access

### 🔗 Blockchain Technology
- **Polkadot ecosystem** and parachain technology
- **Consensus mechanisms** (Proof of Stake vs Proof of Work)
- **Smart contracts** and development guides
- **Cross-chain interoperability**

## Recent Updates

### 🔧 Technical Improvements (Latest)
- ✅ **Interactive Glossary** - Built comprehensive searchable glossary with Typesense integration and fallback search
- ✅ **React Islands Architecture** - Implemented Astro React islands for interactive components
- ✅ **Monorepo Structure** - Migrated to pnpm monorepo with shared packages and configurations
- ✅ **API Endpoints** - Added rate-limited quote API with proper error handling
- ✅ **Fixed canonical URL bug** - Resolved incorrect canonical URL generation that was causing SEO issues
- ✅ **Fixed breadcrumb schema** - Corrected structured data for better search engine understanding
- ✅ **Enhanced mobile menu** - Improved spacing and indentation for better user experience
- ✅ **SEO optimization** - Added proper robots meta tags and pagination handling

### 📝 Content Updates
- ✅ **47+ articles** covering SORA ecosystem and DeFi topics
- ✅ **Chronological update checklist** for maintaining content freshness
- ✅ **Category organization** for better content discovery
- ✅ **Social media integration** for content sharing

<br>

## Related Projects

- [SORA Network](https://sora.org) - The official SORA blockchain network
- [Polkaswap](https://polkaswap.io) - Decentralized exchange on SORA
- [SORA Wiki](https://wiki.sora.org) - Comprehensive SORA ecosystem documentation
- [AstroWind](https://github.com/onwidget/astrowind) - The original Astro template this project is based on

## Contributing

We welcome contributions to improve Soranauts! Whether you want to:

- 📝 **Write content** about SORA ecosystem developments
- 🐛 **Report bugs** or suggest improvements
- 🔧 **Fix technical issues** or enhance functionality
- 📊 **Improve SEO** or performance
- 🎨 **Enhance design** or user experience

Please feel free to open a discussion, create an issue, or submit a pull request. Your contributions help make Soranauts the go-to resource for SORA ecosystem information.

## Acknowledgements

Soranauts is built on the excellent [AstroWind](https://github.com/onwidget/astrowind) template by [onWidget](https://onwidget.com) and maintained by the Soranauts community. Special thanks to the SORA ecosystem team for their innovative blockchain technology and the contributors who help make this platform a valuable resource for the community.

## License

**Soranauts** is licensed under the MIT license — see the [LICENSE](./LICENSE.md) file for details.
