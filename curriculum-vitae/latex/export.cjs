#!/usr/bin/env node
/**
 * Generates LaTeX sections from data.json, then compiles to PDF via Docker.
 * Prerequisites: Docker running with internet access (pulls texlive/texlive on first run).
 *
 * Usage: node export.cjs [--dpi=<n>]
 * Output: latex/output/Antonio_Acquavia_CV_v<major>.<minor>.<patch>.pdf       (full quality)
 *         latex/output/Antonio_Acquavia_CV_v<major>.<minor>.<patch>_flat.pdf  (always; compressed, for size-limited uploads)
 *
 * The _flat PDF is produced with Ghostscript: active content (JavaScript) is removed,
 * images are downsampled to --dpi (default 300, use e.g. --dpi=150 for an even smaller
 * file) and re-encoded as JPEG; text, fonts and links are preserved.
 * The old --flat flag is still accepted but no longer needed.
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
// 7. Post-process with Ghostscript: flattened + compressed copy (always)
// ---------------------------------------------------------------------------
const dpiArg = process.argv.find(a => a.startsWith('--dpi='));
const dpi = dpiArg ? parseInt(dpiArg.split('=')[1], 10) : 300;
if (!Number.isInteger(dpi) || dpi <= 0) {
  console.error(`\n✗ Invalid --dpi value: ${dpiArg}`);
  process.exit(1);
}

const pdfPath     = path.join(OUT_DIR, `${PDF_NAME}.pdf`);
const flatPdfName = `${PDF_NAME}_flat`;
const flatPdfPath = path.join(OUT_DIR, `${flatPdfName}.pdf`);

/** Runs Ghostscript (pdfwrite) inside the TeX Live container on a file in OUT_DIR. */
function runGs(outName, extraArgs, label) {
  const gsCmd = [
    'gs',
    '-dBATCH', '-dNOPAUSE', '-dNOSAFER', '-dQUIET',
    '-sDEVICE=pdfwrite',
    ...extraArgs,
    `-sOutputFile=/output/${outName}.pdf`,
    `/output/${PDF_NAME}.pdf`,
  ].join(' ');

  const result = spawnSync('docker', [
    'run', '--rm',
    '-v', `${outMount}:/output`,
    image,
    'bash', '-c', gsCmd,
  ], { stdio: 'inherit' });

  if (result.status !== 0) {
    console.error(`\n✗ ${label} failed.`);
    process.exit(1);
  }
}

console.log(`\n→ Creating flat compressed PDF (images at ${dpi} dpi)...`);
runGs(flatPdfName, [
  '-dCompatibilityLevel=1.5',
  '-dNOJAVASCRIPT',
  '-dPDFSETTINGS=/ebook',
  '-dDetectDuplicateImages=true',
  '-dEmbedAllFonts=true', '-dSubsetFonts=true',
  '-dDownsampleColorImages=true', '-dColorImageDownsampleType=/Bicubic',
  `-dColorImageResolution=${dpi}`, '-dColorImageDownsampleThreshold=1.0',
  '-dDownsampleGrayImages=true', '-dGrayImageDownsampleType=/Bicubic',
  `-dGrayImageResolution=${dpi}`, '-dGrayImageDownsampleThreshold=1.0',
  '-dAutoFilterColorImages=false', '-dColorImageFilter=/DCTEncode',
  '-dAutoFilterGrayImages=false', '-dGrayImageFilter=/DCTEncode',
  '-dJPEGQ=80',
], 'Compression');

// ---------------------------------------------------------------------------
// 8. Persist bumped version and log the build
// ---------------------------------------------------------------------------
if (fs.existsSync(pdfPath)) {
  fs.writeFileSync(VERSION_FILE, JSON.stringify(version, null, 2) + '\n');

  const datetime = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const logPath = path.join(OUT_DIR, 'builds.log');
  fs.appendFileSync(logPath, `${datetime}  ${versionStr}  +flat@${dpi}dpi  →  ${PDF_NAME}.pdf\n`);

  const size = (p) => `${(fs.statSync(p).size / 1024).toFixed(0)} KB`;
  console.log(`\n✓ PDF generated: ${pdfPath}  (${size(pdfPath)})`);
  console.log(`✓ Flat PDF:      ${flatPdfPath}  (${size(flatPdfPath)})`);
  console.log(`  Version: ${versionStr}  |  ${datetime}`);
} else {
  console.error('\n✗ PDF not found after compilation.');
  process.exit(1);
}
