const env = {
  NODE_ENV: 'test',
  FEATURE_GLOSSARY_V2025: 'true',
  FEATURE_GLOSSARY_UI_CANONICAL: 'true',
  FEATURE_GLOSSARY_ALIAS_REDIRECT: 'false',
  FEATURE_GLOSSARY_V3_UI: 'true',
  FEATURE_GLOSSARY_RELATED_ARTICLES: 'true',
  FEATURE_EXPLORER_GLOSSARY_CONTEXT: 'true',
  GLOSSARY_CARD_SHOW_UPDATED: 'false',
};

for (const [key, value] of Object.entries(env)) {
  if (process.env[key] === undefined) {
    process.env[key] = value;
  }
}

