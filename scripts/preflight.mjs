/**
 * Checks private-file exclusions and scans Git-eligible text for known credential patterns; not a full security audit.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });

// ========================================
// PRIVATE FILE EXCLUSIONS
// ========================================
const privateFiles = ['PRD.md', 'architecture.md', 'rules.md', 'phases.doc.md', 'design.md', 'memory.md', 'CODEX_MASTER_PROMPT.md', 'MASTER_PROMPT.md', 'Master Prompt.md'];
const tracked = new Set(git('ls-files', '-z').split('\0').filter(Boolean));
const issues = [];
for (const file of privateFiles) {
  if (tracked.has(file)) issues.push(`${file}: private document is tracked`);
  try { git('check-ignore', '--no-index', '--', file); }
  catch { issues.push(`${file}: missing Git exclusion`); }
}

// ========================================
// CREDENTIAL SCAN RULES
// ========================================
const files = [...new Set(git('ls-files', '--cached', '--others', '--exclude-standard', '-z').split('\0').filter(Boolean))];
const sensitiveName = /(?:^|\/)(?:\.env(?:\.(?!example$).*)?|\.npmrc|credentials[^/]*\.json|service-account[^/]*\.json)$|\.(?:pem|key|p12|pfx)$/i;
const patterns = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ['AWS access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['live payment key', /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}\b/],
  ['OpenAI project key', /\bsk-proj-[A-Za-z0-9_-]{30,}\b/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}\b/],
];

// ========================================
// GIT-ELIGIBLE FILE SCAN
// ========================================
let scanned = 0;
for (const file of files) {
  if (sensitiveName.test(file)) issues.push(`${file}: sensitive filename eligible for Git`);
  if (!/\.(?:[cm]?js|jsx|css|json|md|html|ya?ml|toml|txt|example)$|(?:^|\/)\.[^/]+$/.test(file)) continue;
  const text = readFileSync(file, 'utf8');
  if (text.includes('\0')) continue;
  scanned++;
  text.split(/\r?\n/).forEach((line, index) => {
    for (const [kind, pattern] of patterns) {
      if (pattern.test(line)) issues.push(`${file}:${index + 1}: possible ${kind} (value withheld)`);
    }
  });
}

// ========================================
// PREFLIGHT REPORT
// ========================================
if (issues.length) {
  console.error(issues.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${privateFiles.length} private document names excluded; ${files.length} eligible files reviewed, ${scanned} text files scanned; no known credential patterns or sensitive filenames detected.`);
  console.log('This pattern scan supplements manual review; it cannot prove the absence of every possible secret.');
}
