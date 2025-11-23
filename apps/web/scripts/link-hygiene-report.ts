import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.resolve(DIRNAME, '../src/content/post');
const OUTPUT_PATH = '/tmp/link_hygiene_report.json';

interface LinkIssue {
  file: string;
  line: number;
  type: 'markdownExternal' | 'missingTargetRel' | 'absoluteInternal';
  snippet: string;
}

interface ReportPayload {
  summary: {
    filesScanned: number;
    totalViolations: number;
    reportPath: string;
  };
  violations: LinkIssue[];
}

const files = fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith('.mdx'));
const violations: LinkIssue[] = [];

for (const file of files) {
  const fullPath = path.join(POSTS_DIR, file);
  const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    const markdownMatch = trimmed.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/g);
    if (markdownMatch) {
      for (const match of markdownMatch) {
        violations.push({
          file,
          line: index + 1,
          type: 'markdownExternal',
          snippet: match,
        });
      }
    }

    const htmlLinkPattern = /<a\s+[^>]*href="(https?:\/\/[^"]+)"[^>]*>/gi;
    let htmlMatch: RegExpExecArray | null;
    while ((htmlMatch = htmlLinkPattern.exec(line)) !== null) {
      const linkTag = htmlMatch[0];
      const hasTarget = /target="_blank"/i.test(linkTag);
      const hasRel = /rel="noopener noreferrer"/i.test(linkTag);

      if (!hasTarget || !hasRel) {
        violations.push({
          file,
          line: index + 1,
          type: 'missingTargetRel',
          snippet: linkTag,
        });
      }
    }

    const absoluteInternalMatch = trimmed.match(/https?:\/\/[^)"'\s]+\/[^\s)"']*/g);
    if (absoluteInternalMatch) {
      for (const match of absoluteInternalMatch) {
        if (isInternalUrl(match)) {
          violations.push({
            file,
            line: index + 1,
            type: 'absoluteInternal',
            snippet: match,
          });
        }
      }
    }
  });
}

const report: ReportPayload = {
  summary: {
    filesScanned: files.length,
    totalViolations: violations.length,
    reportPath: OUTPUT_PATH,
  },
  violations,
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2));

console.log('=== Link Hygiene Report ===');
console.table(
  violations.slice(0, 50).map((violation) => ({
    file: violation.file,
    line: violation.line,
    type: violation.type,
  })),
);
if (violations.length > 50) {
  console.log(`(Showing first 50 of ${violations.length} violations)`);
}
console.log(`Report saved to ${OUTPUT_PATH}`);

function isInternalUrl(url: string): boolean {
  return url.startsWith('https://soranauts.com/') || url.startsWith('http://soranauts.com/');
}

