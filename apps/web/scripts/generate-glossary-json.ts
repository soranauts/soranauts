import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptPath = path.resolve(__dirname, '../../..', 'scripts', 'generate-glossary-json.ts');

await import(pathToFileURL(scriptPath).href);

