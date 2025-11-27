#!/usr/bin/env node

import { execSync } from 'node:child_process';

const tagName = process.argv[2] ?? 'glossary-v2025-release';

const tagMessage = `Glossary v2025 release
- Phase 6: dataset validation & repairs
- Phase 7: V2025 UI migration (flagged)
- Phase 8: canonical UI + alias redirect
- Phase 9: analytics, SEO, sitemaps, middleware
- Phase 10: V3 React term layout
- Phase 11: autolink QA + relations map
- Phase 12: Explorer glossary context
- Phase 13: cross-system tests
- Phase 14: release prep & lockdown`;

const commands = [
  'git fetch --all --tags',
  'git checkout main',
  'git pull --ff-only',
  `git tag -a ${tagName} -m "${tagMessage}"`,
  `git push origin ${tagName}`,
];

console.log(`\n[release-tag] Preparing Glossary v2025 tag: ${tagName}\n`);

for (const cmd of commands) {
  console.log(`[release-tag] $ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

console.log('\n[release-tag] Tagging complete. Commands executed above.\n');

