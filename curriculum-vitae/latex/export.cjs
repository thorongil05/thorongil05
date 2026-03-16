#!/usr/bin/env node
/**
 * Generates LaTeX sections from data.json, then compiles to PDF via Docker.
 * Prerequisites: Docker running with internet access (pulls texlive/texlive on first run).
 *
 * Usage: node export.cjs
 * Output: latex/output/Antonio_Acquavia_CV.pdf
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LATEX_DIR = __dirname;
const SRC_DIR   = path.join(LATEX_DIR, 'src');
const OUT_DIR   = path.join(LATEX_DIR, 'output');
const PDF_NAME  = 'Antonio_Acquavia_CV';

// ---------------------------------------------------------------------------
// 1. Generate .tex sections from data.json
// ---------------------------------------------------------------------------
console.log('→ Generating LaTeX sections...');
execSync(`node "${path.join(LATEX_DIR, 'build.cjs')}"`, { stdio: 'inherit' });

// ---------------------------------------------------------------------------
// 2. Ensure output directory exists
// ---------------------------------------------------------------------------
fs.mkdirSync(OUT_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// 3. Check Docker is available
// ---------------------------------------------------------------------------
const dockerCheck = spawnSync('docker', ['info'], { stdio: 'pipe' });
if (dockerCheck.status !== 0) {
  console.error('\n✗ Docker is not running or not installed.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 4. Convert paths for Docker (Windows → POSIX for bind mounts)
// ---------------------------------------------------------------------------
function toDockerPath(winPath) {
  // C:\Users\... → /c/Users/...
  return winPath.replace(/\\/g, '/').replace(/^([A-Z]):/, (_, d) => `/${d.toLowerCase()}`);
}

const srcMount = toDockerPath(SRC_DIR);
const outMount = toDockerPath(OUT_DIR);

// ---------------------------------------------------------------------------
// 5. Compile with xelatex inside Docker (run twice for correct layout)
// ---------------------------------------------------------------------------
const image = 'texlive/texlive';
const compileCmd = [
  'lualatex',
  '-interaction=nonstopmode',
  `-jobname=${PDF_NAME}`,
  '-output-directory=/output',
  'main.tex',
].join(' ');

const dockerArgs = [
  'run', '--rm',
  '-v', `${srcMount}:/workspace`,
  '-v', `${outMount}:/output`,
  image,
  'bash', '-c', `cd /workspace && ${compileCmd} && ${compileCmd}`,
];

console.log('\n→ Compiling PDF with xelatex (this may take a while on first run)...');
const result = spawnSync('docker', dockerArgs, { stdio: 'inherit' });

if (result.status !== 0) {
  console.error('\n✗ Compilation failed. Check the log above for errors.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 6. Done
// ---------------------------------------------------------------------------
const pdfPath = path.join(OUT_DIR, `${PDF_NAME}.pdf`);
if (fs.existsSync(pdfPath)) {
  console.log(`\n✓ PDF generated: ${pdfPath}`);
} else {
  console.error('\n✗ PDF not found after compilation.');
  process.exit(1);
}
