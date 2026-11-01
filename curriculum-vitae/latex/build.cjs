#!/usr/bin/env node
/**
 * Generates the LaTeX sources of the CV from data.json (layout: src/cvmodern.cls).
 * Usage: node build.cjs
 * Output: latex/src/main.tex + latex/src/sections/*.tex
 *
 * PDF-only options live in data.json -> cv_pdf (ignored by the React site):
 *   programming_core   languages highlighted in the sidebar
 *   data_skills        extra tools shown in the "Data & Cloud" group
 *   highlight_tasks    { "<company>": N } -> first N tasks rendered in bold
 *   at_a_glance        key facts shown in the page-2 sidebar
 *   spoken_languages   [{ "name": "English", "level": "C1" }] (section hidden if empty)
 *   company_display    { "ION GROUP": "ION Group" } -> display name override
 *   gdpr               consent line printed at the bottom of the last sidebar
 *
 * skills.programming_levels is intentionally NOT rendered: an explicit low level on
 * non-core languages can hurt more than simply listing the language.
 */

const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json'), 'utf8'));
const pdf = data.cv_pdf || {};
const outDir = path.join(__dirname, 'src/sections');
const srcDir = path.join(__dirname, 'src');
fs.mkdirSync(outDir, { recursive: true });

// Read email from local .env (VITE_CV_EMAIL=...) — never committed to git
const envPath = path.join(__dirname, '../.env');
let email = data.personal_info.contacts.email;
if (fs.existsSync(envPath)) {
  const match = fs.readFileSync(envPath, 'utf8').match(/^VITE_CV_EMAIL=(.+)$/m);
  if (match) email = match[1].trim();
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Escape special LaTeX characters in plain text (not in URLs). */
function esc(str = '') {
  return String(str)
    .replace(/\$/g, '')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/#/g, '\\#')
    .replace(/(?<![\\])_/g, '\\_');
}

/** Escape a URL for \href / \url. */
const url = (u) => u.replace(/%/g, '\\%').replace(/#/g, '\\#');

function write(filename, content) {
  fs.writeFileSync(path.join(outDir, filename), content);
  console.log(`  ✓ ${filename}`);
}

const MONTHS = {
  January: 'JAN', February: 'FEB', March: 'MAR', April: 'APR', May: 'MAY', June: 'JUN',
  July: 'JUL', August: 'AUG', September: 'SEP', October: 'OCT', November: 'NOV', December: 'DEC',
};

/** "March 2023 - Present" -> "MAR 2023 — PRESENT" */
function fmtPeriod(period = '') {
  return period
    .split(' - ')
    .map(p => p.replace(/[A-Za-z]+/g, w => MONTHS[w] || w.toUpperCase()))
    .join(' — ');
}

const chips = (list = [], cmd = 'chip') => list.map(t => `\\${cmd}{${esc(t)}}`).join(' ');
const companyName = (c) => (pdf.company_display || {})[c] || c;
const shortHost = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

// ---------------------------------------------------------------------------
// Sidebar — page 1
// ---------------------------------------------------------------------------

const { name, role, contacts, summary, summary_en } = data.personal_info;
const [firstName, ...rest] = name.split(' ');
const lastName = rest.join(' ');

const contactLines = [
  `\\contact{\\faEnvelope}{\\href{mailto:${email}}{${esc(email)}}}`,
  contacts.address && `\\contact{\\faMapMarker*}{${esc(contacts.address)}}`,
  contacts.linkedin && `\\contact{\\faLinkedin}{\\href{${url(contacts.linkedin)}}{${esc(shortHost(contacts.linkedin).replace('linkedin.com/', ''))}}}`,
  contacts.github && `\\contact{\\faGithub}{\\href{${url(contacts.github)}}{${esc(shortHost(contacts.github))}}}`,
  contacts.portfolio && `\\contact{\\faGlobe}{\\href{${url(contacts.portfolio)}}{Portfolio}}`,
].filter(Boolean).join('\n');

const core = new Set(pdf.programming_core || []);
const progOrdered = [
  ...data.skills.programming.filter(l => core.has(l)),
  ...data.skills.programming.filter(l => !core.has(l)),
];
const progChips = progOrdered
  .map(l => core.has(l) ? `\\sidechipcore{${esc(l)}}` : `\\sidechip{${esc(l)}}`)
  .join(' ');

const skillGroups = [
  ['Languages', progChips],
  ['Frameworks', chips(data.skills.frameworks, 'sidechip')],
  ['Data \\& Cloud', chips([...data.skills.cloud, ...(pdf.data_skills || [])], 'sidechip')],
  ['Databases', chips(data.skills.databases, 'sidechip')],
].map(([label, c]) => `\\sidelabel{${label}}\n\\chipgroup{${c}}`).join('\n');

const softSkills = data.skills.soft_skills.map(s => `  \\item ${esc(s)}`).join('\n');

const interests = data.interests
  .map(i => typeof i === 'object'
    ? `\\interest{${esc(i.category)}}{${esc(i.detail)}}`
    : `\\interest{}{${esc(i)}}`)
  .join('\n');

write('sidebar_page1.tex',
`\\cvphoto
\\sidesection{Contact}
${contactLines}
\\sidegap
\\sidesection{Skills}
${skillGroups}
\\sidegap
\\sidesection{Soft skills}
\\begin{sidelist}
${softSkills}
\\end{sidelist}
\\sidegap
\\sidesection{Interests}
${interests}
`);

// ---------------------------------------------------------------------------
// Sidebar — page 2
// ---------------------------------------------------------------------------

const glance = (pdf.at_a_glance || []).map(s => `  \\item ${esc(s)}`).join('\n');
const spoken = (pdf.spoken_languages || [])
  .map(l => `\\interest{${esc(l.name)}}{${esc(l.level)}}`).join('\n');

write('sidebar_page2.tex',
[
  glance && `\\sidesection{At a glance}\n\\begin{sidelist}\n${glance}\n\\end{sidelist}`,
  spoken && `\\sidesection{Languages}\n${spoken}`,
].filter(Boolean).join('\n\\sidegap\n') + '\n');

// ---------------------------------------------------------------------------
// Header + summary
// ---------------------------------------------------------------------------

write('section_header.tex',
`\\cvheader{${esc(firstName)}}{${esc(lastName)}}{${esc(role)}}
\\cvsummary{${esc(summary_en || summary)}}
`);

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

const highlight = pdf.highlight_tasks || {};
const expEntries = data.experience.map((exp) => {
  const nHl = highlight[exp.company] || 0;
  const current = /Present$/.test(exp.period) ? 1 : 0;
  const pubRe = /^Published results/i;
  const tasks = (exp.tasks || [])
    .filter(t => !(exp.publication && pubRe.test(t)))
    .map((t, i) => i < nHl ? `  \\hltask{${esc(t)}}` : `  \\item ${esc(t)}`)
    .join('\n');
  const body = tasks
    ? `\\begin{tasks}\n${tasks}\n\\end{tasks}`
    : (exp.highlights ? `{\\small ${esc(exp.highlights)}}\\par\\vspace{1.4mm}` : '');
  const pub = exp.publication
    ? `\n\\publication{${esc(exp.publication.title)}}{${esc(exp.publication.venue)} (ACM)}{${url(exp.publication.url)}}`
    : '';

  return `\\begin{cventry}{${esc(exp.role)}}{${esc(companyName(exp.company))}}{${fmtPeriod(exp.period)}}{${current}}
${body}${pub}
\\stack{${chips(exp.tech_stack)}}
\\end{cventry}`;
}).join('\n\n');

write('section_experience.tex', `\\cvsection{Experience}\n\n${expEntries}\n`);

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

const eduEntries = data.education.map(e =>
  `\\cvedu{${esc(e.degree)}}{${esc(e.institution)}}{${fmtPeriod(e.period)}}{${esc(e.mark || '')}}{${esc(e.highlights || '')}}`
).join('\n');

write('section_education.tex', `\\cvsection{Education}\n\n${eduEntries}\n`);

// ---------------------------------------------------------------------------
// Projects (first one featured, full width; the others in a 2-column grid)
// ---------------------------------------------------------------------------

function projectBox(p, featured) {
  const links = [];
  if (p.link) links.push(`\\projlink{${url(p.link)}}{live demo}`);
  if (p.github) links.push(`\\projlink{${url(p.github)}}{repository}`);
  if (p.wiki) links.push(`\\projlink{${url(p.wiki)}}{wiki}`);
  return `\\cvproject${featured ? '[accent]' : ''}{${esc(p.name)}}{${fmtPeriod(p.period || '')}}
  {${esc(p.description)}}
  {${links.join(' \\quad ')}}
  {${chips(p.tech_stack)}}`;
}

const [featured, ...others] = data.projects;
const grid = others.map(p => projectBox(p, false)).join('\n');

write('section_projects.tex',
`\\cvsection{Selected Projects}

${featured ? projectBox(featured, true) : ''}
\\vspace{1mm}
\\begin{tcbraster}[raster columns=2,raster equal height=rows,raster column skip=3mm,raster row skip=3mm]
${grid}
\\end{tcbraster}
`);

// ---------------------------------------------------------------------------
// main.tex
// ---------------------------------------------------------------------------

fs.writeFileSync(path.join(srcDir, 'main.tex'),
`% Generated by latex/build.cjs — do not edit by hand.
\\documentclass{cvmodern}
\\setphoto{res/my_photo.jpg}
\\hypersetup{pdftitle={${esc(name)} - CV}, pdfauthor={${esc(name)}}}
\\renewcommand\\cvfootername{${esc(name)}}

\\sidebarpage{1}{\\input{sections/sidebar_page1}}
\\sidebarpage{2}{\\input{sections/sidebar_page2}}
\\sidebarbottom{${esc(pdf.gdpr || '')}}

\\begin{document}
\\input{sections/section_header}
\\input{sections/section_experience}
\\input{sections/section_education}
\\input{sections/section_projects}
\\end{document}
`);
console.log('  ✓ main.tex');

console.log('\nDone! All sections generated in latex/src/sections/');
