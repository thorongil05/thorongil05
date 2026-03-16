#!/usr/bin/env node
/**
 * Generates LaTeX sections from data.json, then compiles to PDF via Docker.
 * Prerequisites: Docker running with internet access (pulls texlive/texlive on first run).
 *
 * Usage: node export.cjs
 * Output: latex/output/Antonio_Acquavia_CV_v<major>.<minor>.<patch>.pdf
 *
 * Version is tracked in latex/version.json.
 * Patch is auto-incremented on each successful build.
 * Edit version.json manually to bump major or minor.
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LATEX_DIR    = __dirname;
const SRC_DIR      = path.join(LATEX_DIR, 'src');
const OUT_DIR      = path.join(LATEX_DIR, 'output');
const VERSION_FILE = path.join(LATEX_DIR, 'version.json');

// ---------------------------------------------------------------------------
// 1. Read and bump version
// ---------------------------------------------------------------------------
const version = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
version.patch += 1;
const versionStr = `v${version.major}.${version.minor}.${version.patch}`;
const PDF_NAME = `Antonio_Acquavia_CV_${versionStr}`;

// ---------------------------------------------------------------------------
// 2. Generate .tex sections from data.json
// ---------------------------------------------------------------------------
console.log('→ Generating LaTeX sections...');
execSync(`node "${path.join(LATEX_DIR, 'build.cjs')}"`, { stdio: 'inherit' });

// ---------------------------------------------------------------------------
// 3. Ensure output directory exists
// ---------------------------------------------------------------------------
fs.mkdirSync(OUT_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// 4. Check Docker is available
// ---------------------------------------------------------------------------
const dockerCheck = spawnSync('docker', ['info'], { stdio: 'pipe' });
if (dockerCheck.status !== 0) {
  console.error('\n✗ Docker is not running or not installed.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 5. Convert paths for Docker (Windows → POSIX for bind mounts)
// ---------------------------------------------------------------------------
function toDockerPath(winPath) {
  return winPath.replace(/\\/g, '/').replace(/^([A-Z]):/, (_, d) => `/${d.toLowerCase()}`);
}

const srcMount = toDockerPath(SRC_DIR);
const outMount = toDockerPath(OUT_DIR);

// ---------------------------------------------------------------------------
// 6. Compile with lualatex inside Docker (run twice for correct layout)
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

console.log(`\n→ Compiling PDF ${versionStr} with lualatex...`);
const result = spawnSync('docker', dockerArgs, { stdio: 'inherit' });

if (result.status !== 0) {
  console.error('\n✗ Compilation failed. Check the log above for errors.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 7. Optionally flatten PDF with Ghostscript (--flat flag)
// ---------------------------------------------------------------------------
const flat = process.argv.includes('--flat');
const pdfPath     = path.join(OUT_DIR, `${PDF_NAME}.pdf`);
const flatPdfName = `${PDF_NAME}_flat`;
const flatPdfPath = path.join(OUT_DIR, `${flatPdfName}.pdf`);

if (flat) {
  console.log('\n→ Flattening PDF (removing active content)...');
  const gsCmd = [
    'gs',
    '-dBATCH', '-dNOPAUSE', '-dNOSAFER',
    '-dCompatibilityLevel=1.4',
    '-dNOJAVASCRIPT',
    '-dFastWebView=false',
    '-sDEVICE=pdfwrite',
    `-sOutputFile=/output/${flatPdfName}.pdf`,
    `/output/${PDF_NAME}.pdf`,
  ].join(' ');

  const flatArgs = [
    'run', '--rm',
    '-v', `${outMount}:/output`,
    image,
    'bash', '-c', gsCmd,
  ];

  const flatResult = spawnSync('docker', flatArgs, { stdio: 'inherit' });
  if (flatResult.status !== 0) {
    console.error('\n✗ Flattening failed.');
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// 8. Persist bumped version and log the build
// ---------------------------------------------------------------------------
if (fs.existsSync(pdfPath)) {
  fs.writeFileSync(VERSION_FILE, JSON.stringify(version, null, 2) + '\n');

  const datetime = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const logPath = path.join(OUT_DIR, 'builds.log');
  const flatNote = flat ? `  +flat` : '';
  fs.appendFileSync(logPath, `${datetime}  ${versionStr}${flatNote}  →  ${PDF_NAME}.pdf\n`);

  console.log(`\n✓ PDF generated: ${pdfPath}`);
  if (flat) console.log(`✓ Flat PDF:      ${flatPdfPath}`);
  console.log(`  Version: ${versionStr}  |  ${datetime}`);
} else {
  console.error('\n✗ PDF not found after compilation.');
  process.exit(1);
}
