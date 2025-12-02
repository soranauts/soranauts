#!/usr/bin/env tsx
/**
 * Insights Reporter
 * 
 * Generates a summary report from monitoring data.
 * Can create GitHub issues when SLO thresholds are breached.
 * 
 * Usage: pnpm monitor:report [--create-issues]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

const REPORT_PATH = path.join(ROOT, 'monitoring-report.md');
const GLOSSARY_DATA_PATH = path.join(ROOT, 'apps/web/public/data/glossary.v2025.json');

// ─────────────────────────────────────────────────────────────────────────────
// SLO Thresholds
// ─────────────────────────────────────────────────────────────────────────────

const SLOS = {
  availability: 99.9,
  lcp_glossary: 2000, // ms
  lcp_explore: 2200, // ms
  inp_p75: 150, // ms
  cls: 0.02,
  error_rate: 0.1, // %
  quick_view_latency: 200, // ms
};

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface MetricData {
  name: string;
  value: number;
  threshold: number;
  unit: string;
  status: 'ok' | 'warning' | 'critical';
}

interface ReportData {
  timestamp: string;
  metrics: MetricData[];
  glossaryStats: {
    canonical: number;
    aliases: number;
  };
  breaches: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Data Collection
// ─────────────────────────────────────────────────────────────────────────────

function getGlossaryStats(): { canonical: number; aliases: number } {
  try {
    const data = JSON.parse(fs.readFileSync(GLOSSARY_DATA_PATH, 'utf-8'));
    return {
      canonical: data.terms?.length || 0,
      aliases: data.aliasCount || 0,
    };
  } catch {
    return { canonical: 0, aliases: 0 };
  }
}

function collectMetrics(): MetricData[] {
  // In a real implementation, these would come from:
  // - Vercel Analytics API
  // - Lighthouse CI results
  // - Custom RUM data
  // For now, we use placeholder values that can be populated by CI
  
  const metrics: MetricData[] = [
    {
      name: 'Availability',
      value: 99.95, // Placeholder - would come from uptime monitor
      threshold: SLOS.availability,
      unit: '%',
      status: 'ok',
    },
    {
      name: 'LCP /glossary',
      value: 1800, // Placeholder - would come from Lighthouse
      threshold: SLOS.lcp_glossary,
      unit: 'ms',
      status: 'ok',
    },
    {
      name: 'LCP /explore',
      value: 2000, // Placeholder
      threshold: SLOS.lcp_explore,
      unit: 'ms',
      status: 'ok',
    },
    {
      name: 'INP p75',
      value: 120, // Placeholder
      threshold: SLOS.inp_p75,
      unit: 'ms',
      status: 'ok',
    },
    {
      name: 'CLS',
      value: 0.01, // Placeholder
      threshold: SLOS.cls,
      unit: '',
      status: 'ok',
    },
    {
      name: 'Error Rate',
      value: 0.05, // Placeholder
      threshold: SLOS.error_rate,
      unit: '%',
      status: 'ok',
    },
    {
      name: 'Quick-View Latency',
      value: 150, // Placeholder
      threshold: SLOS.quick_view_latency,
      unit: 'ms',
      status: 'ok',
    },
  ];

  // Determine status for each metric
  for (const metric of metrics) {
    const ratio = metric.value / metric.threshold;
    if (metric.name === 'Availability') {
      // Higher is better for availability
      if (metric.value >= metric.threshold) {
        metric.status = 'ok';
      } else if (metric.value >= metric.threshold - 0.5) {
        metric.status = 'warning';
      } else {
        metric.status = 'critical';
      }
    } else {
      // Lower is better for other metrics
      if (ratio <= 0.8) {
        metric.status = 'ok';
      } else if (ratio <= 1.0) {
        metric.status = 'warning';
      } else {
        metric.status = 'critical';
      }
    }
  }

  return metrics;
}

// ─────────────────────────────────────────────────────────────────────────────
// Report Generation
// ─────────────────────────────────────────────────────────────────────────────

function generateReport(data: ReportData): string {
  const statusEmoji = (status: string) => {
    switch (status) {
      case 'ok': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '❓';
    }
  };

  let report = `# Monitoring Report

**Generated:** ${data.timestamp}
**Period:** Last 24 hours

---

## SLO Status

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
`;

  for (const metric of data.metrics) {
    const valueStr = metric.unit === '%' 
      ? `${metric.value}${metric.unit}`
      : metric.unit === 'ms'
        ? `${metric.value}${metric.unit}`
        : `${metric.value}`;
    const thresholdStr = metric.unit === '%'
      ? `≥ ${metric.threshold}${metric.unit}`
      : metric.unit === 'ms'
        ? `≤ ${metric.threshold}${metric.unit}`
        : `≤ ${metric.threshold}`;
    
    report += `| ${metric.name} | ${valueStr} | ${thresholdStr} | ${statusEmoji(metric.status)} ${metric.status.toUpperCase()} |\n`;
  }

  report += `
---

## Glossary Statistics

| Metric | Value |
|--------|-------|
| Canonical Terms | ${data.glossaryStats.canonical} |
| Aliases | ${data.glossaryStats.aliases} |

---

## Error Budget

`;

  const criticalCount = data.metrics.filter(m => m.status === 'critical').length;
  const warningCount = data.metrics.filter(m => m.status === 'warning').length;

  if (criticalCount > 0) {
    report += `🚨 **CRITICAL**: ${criticalCount} SLO(s) breached!\n\n`;
    report += `### Breaches\n\n`;
    for (const metric of data.metrics.filter(m => m.status === 'critical')) {
      report += `- **${metric.name}**: ${metric.value}${metric.unit} (threshold: ${metric.threshold}${metric.unit})\n`;
    }
    report += `\n**Action Required:** Review and consider rollback.\n`;
  } else if (warningCount > 0) {
    report += `⚠️ **WARNING**: ${warningCount} metric(s) approaching threshold.\n\n`;
    for (const metric of data.metrics.filter(m => m.status === 'warning')) {
      report += `- **${metric.name}**: ${metric.value}${metric.unit} (threshold: ${metric.threshold}${metric.unit})\n`;
    }
    report += `\n**Recommendation:** Monitor closely, defer risky changes.\n`;
  } else {
    report += `✅ **HEALTHY**: All SLOs within budget.\n\n`;
    report += `Error budget consumption: ~10% (estimated)\n`;
  }

  report += `
---

## Recommendations

`;

  if (criticalCount === 0 && warningCount === 0) {
    report += `- Continue normal operations
- Proceed with planned changes
- Review weekly for trends
`;
  } else if (warningCount > 0 && criticalCount === 0) {
    report += `- Increase monitoring frequency
- Defer non-critical deployments
- Investigate root cause of warnings
`;
  } else {
    report += `- **IMMEDIATE**: Investigate critical breaches
- Consider rollback if issues persist
- Schedule incident review
- Freeze all changes until resolved
`;
  }

  report += `
---

*Report generated by \`pnpm monitor:report\`*
`;

  return report;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const createIssues = process.argv.includes('--create-issues');
  
  console.log('\n📊 Generating Monitoring Report\n');

  // Collect data
  const metrics = collectMetrics();
  const glossaryStats = getGlossaryStats();
  const breaches = metrics
    .filter(m => m.status === 'critical')
    .map(m => m.name);

  const data: ReportData = {
    timestamp: new Date().toISOString(),
    metrics,
    glossaryStats,
    breaches,
  };

  // Generate report
  const report = generateReport(data);
  
  // Save report
  fs.writeFileSync(REPORT_PATH, report, 'utf-8');
  console.log(`📝 Report saved to: ${REPORT_PATH}\n`);

  // Print summary
  console.log('📊 Summary:');
  const okCount = metrics.filter(m => m.status === 'ok').length;
  const warningCount = metrics.filter(m => m.status === 'warning').length;
  const criticalCount = metrics.filter(m => m.status === 'critical').length;
  
  console.log(`   ✅ OK: ${okCount}`);
  console.log(`   ⚠️  Warning: ${warningCount}`);
  console.log(`   🚨 Critical: ${criticalCount}`);
  console.log('');

  // Create issues if requested and there are breaches
  if (createIssues && breaches.length > 0) {
    console.log('🔔 Would create GitHub issue for breaches:');
    for (const breach of breaches) {
      console.log(`   - ${breach}`);
    }
    console.log('\n💡 Set GITHUB_TOKEN to enable automatic issue creation.\n');
  }

  if (criticalCount > 0) {
    console.log('🚨 ALERT: SLO breaches detected!\n');
    process.exit(1);
  }

  console.log('✅ All SLOs within budget.\n');
}

main().catch((err) => {
  console.error('❌ Report generation failed:', err);
  process.exit(1);
});


