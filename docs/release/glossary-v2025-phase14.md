## Glossary v2025 — Phase 14 (Release & Lockdown)

### Final production flag state

```
FEATURE_GLOSSARY_V2025=true
FEATURE_GLOSSARY_UI_CANONICAL=true
FEATURE_GLOSSARY_ALIAS_REDIRECT=true
FEATURE_GLOSSARY_V3_UI=true        # enable if V3 approved
FEATURE_GLOSSARY_RELATED_ARTICLES=true  # optional
FEATURE_EXPLORER_GLOSSARY_CONTEXT=true  # optional
GLOSSARY_CARD_SHOW_UPDATED=false
```

### Post-deploy spot checks

1. `/glossary/token-bonding-curve` returns a 308 redirect to `/glossary/bonding-curve`
2. `/glossary/hyperledger-iroha` returns a 308 redirect to `/glossary/iroha`
3. View-source `/glossary/xor` and confirm a single `<link rel="canonical">` pointing to `/glossary/xor`

### Rollback plan

- Flip `FEATURE_GLOSSARY_V2025=false` to disable the new UI globally
- Or revert the release tag / merge commit to restore the previous deployment

### Prior phases

- Phase 10 PR — #10
- Phase 11 PR — #11
- Phase 12 PR — #12
- Phase 13 PR — #14

### Local verification one-liners

```
pnpm --filter @soranauts/web exec tsx scripts/generate-glossary-sitemaps.ts   # expect 52/5
pnpm --filter @soranauts/web test -- --run cross
SKIP_OG_VALIDATION=1 pnpm -w build
```

