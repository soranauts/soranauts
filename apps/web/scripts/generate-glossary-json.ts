/**
 * Generate Glossary JSON
 * 
 * This script delegates to the unified glossary generator at the repo root.
 * The unified generator (build-nexus-glossary-json.ts) is the single source of truth.
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the unified generator from repo root
const scriptPath = path.resolve(__dirname, '../../..', 'scripts', 'build-nexus-glossary-json.ts');

await import(pathToFileURL(scriptPath).href);
