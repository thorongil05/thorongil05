#!/usr/bin/env node
/**
 * Generates LaTeX section files from data.json.
 * Usage: node build.js
 * Output: latex/src/sections/*.tex
 */

const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json'), 'utf8'));
const outDir = path.join(__dirname, 'src/sections');
const srcDir = path.join(__dirname, 'src');

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

/** Escape special LaTeX characters in plain text (not in math mode or URLs). */
function esc(str = '') {
  return str
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/#/g, '\\#')
    .replace(/(?<![\\])_/g, '\\_');
}

function write(filename, content) {
  fs.writeFileSync(path.join(outDir, filename), content);
  console.log(`  ✓ ${filename}`);
}

function parsePeriod(period) {
  const parts = period.split(' - ');
  if (parts.length === 1) return { start: '', end: parts[0] };
  const end = parts[1] === 'Present' ? 'Now' : parts[1];
  return { start: parts[0], end };
}

// ---------------------------------------------------------------------------
// section_headline.tex
// ---------------------------------------------------------------------------

write('section_headline.tex',
`\\par{
${esc(data.personal_info.summary_en)}
}
`);

// ---------------------------------------------------------------------------
// section_honors_awards.tex  (Education)
// ---------------------------------------------------------------------------

const eduEntries = data.education.map(e => {
  const { start, end } = parsePeriod(e.period);
  const periodStr = start ? `${esc(end)}\\\\${esc(start)}` : esc(end);

  const items = [];
  if (e.mark) items.push(`\\item Mark: ${e.mark}`);
  if (e.highlights) items.push(`\\item ${esc(e.highlights)}`);
  const itemBlock = items.length
    ? `\n\t\t\t\t\\begin{itemize}\n${items.map(i => `\t\t\t\t    ${i}`).join('\n')}\n\t\t\t\t\\end{itemize}\n\t\t\t`
    : '';

  return `\t\\scholarshipentry{${periodStr}}\n\t\t\t\t{${esc(e.degree)}, at ${esc(e.institution)}.${itemBlock}}`;
}).join('\n\t\n');

write('section_honors_awards.tex',
`\\sectionTitle{Education}{\\faMortarBoard}

\\begin{scholarship}
${eduEntries}

\\end{scholarship}
`);

// ---------------------------------------------------------------------------
// section_experience.tex
// ---------------------------------------------------------------------------

const expEntries = data.experience.map((exp, i) => {
  const { start, end } = parsePeriod(exp.period);
  const taskLines = (exp.tasks || [])
    .map(t => `\t\t\t\t\t\t\\item ${esc(t)}`)
    .join('\n');
  const pubLine = exp.publication
    ? `\n\t\t\t\t\t\t\\href{${exp.publication.url}}{\\textit{${esc(exp.publication.title)}}} --- ${esc(exp.publication.venue)}.`
    : '';
  const body = taskLines
    ? `\n\t\t\t\t\t\t\\begin{itemize}\n${taskLines}\n\t\t\t\t\t\t\\end{itemize}${pubLine}`
    : (exp.highlights ? `\n\t\t\t\t\t\t${esc(exp.highlights)}` : '');
  const tech = (exp.tech_stack || []).map(esc).join(', ');
  const sep = i < data.experience.length - 1 ? '\n\t\\emptySeparator' : '';

  return `\t\\experience
\t\t{${esc(end)}} {${esc(exp.role)}}{${esc(exp.company)}}{}
\t\t{${esc(start)}} {${body}
\t\t}
\t\t{${tech}}${sep}`;
}).join('\n');

write('section_experience.tex',
`\\sectionTitle{Experience}{\\faSuitcase}
\\begin{experiences}
${expEntries}
\\end{experiences}
`);

// ---------------------------------------------------------------------------
// section_skills.tex
// ---------------------------------------------------------------------------

const skillEntries = [
  `\t\\keywordsentry{Programming}{${data.skills.programming.map(esc).join(', ')}}`,
  `\t\\keywordsentry{Frameworks}{${data.skills.frameworks.map(esc).join(', ')}}`,
  `\t\\keywordsentry{Cloud Providers}{${data.skills.cloud.map(esc).join(', ')}}`,
  `\t\\keywordsentry{Databases}{${data.skills.databases.map(esc).join(', ')}}`,
].join('\n');

write('section_skills.tex',
`\\sectionTitle{Skills}{\\faTasks}

\\begin{keywords}
${skillEntries}
\\end{keywords}
`);

// ---------------------------------------------------------------------------
// section_languages.tex  (programming skill bars + soft skills)
// ---------------------------------------------------------------------------

const progLevels = Object.entries(data.skills.programming_levels)
  .map(([lang, level]) => `\t\t\\skill{${esc(lang)}}{${level}}`)
  .join('\n');

const softSkills = data.skills.soft_skills
  .map(s => `\t\t\\item ${esc(s)}`)
  .join('\n');

write('section_languages.tex',
`\\\\[2px]
\\twocolumnsection{
\t\\sectionTitle{Programming Languages}{\\faCode}
\t\\begin{skills}
${progLevels}
\t\\end{skills}
}{
\t\\sectionTitle{Soft skills}{\\faPlus}
\t\\vspace{1em}
\t\\begin{itemize}
${softSkills}
\t\\end{itemize}
}
`);

// ---------------------------------------------------------------------------
// section_interests.tex
// ---------------------------------------------------------------------------

const interestRows = data.interests.map(i => {
  if (typeof i === 'object') {
    return `\t\\textsc{${esc(i.category)}:} & ${esc(i.detail)}. \\\\`;
  }
  return `\t & ${esc(i)}. \\\\`;
}).join('\n');

write('section_interests.tex',
`\\sectionTitle{Interests}{\\faLightbulbO}
\\begin{tabular}{rl}
${interestRows}
\\end{tabular}
`);

// ---------------------------------------------------------------------------
// section_projects.tex
// ---------------------------------------------------------------------------

const projectEntries = data.projects.map(p => {
  const links = [];
  if (p.github) links.push(`\t\\github{${p.github}}{repository}`);
  if (p.wiki)   links.push(`\t\\website{${p.wiki}}{Wiki}`);
  if (p.link)   links.push(`\t\\website{${p.link}}{link}`);
  const linkBlock = links.length ? `\n\t{${links.join('\n')}}` : '\n\t{}';
  const tech = (p.tech_stack || []).map(esc).join(', ');

  return `\t\\project
\t{${esc(p.name)}}{${esc(p.period || '')}}${linkBlock}
\t{${esc(p.description)}}
\t{${tech}}`;
}).join('\n');

write('section_projects.tex',
`\\sectionTitle{Main Projects}{\\faLaptop}

\\begin{projects}
${projectEntries}
\\end{projects}
`);

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// main.tex  (personal info from data.json)
// ---------------------------------------------------------------------------

const { name, role, contacts } = data.personal_info;
const [firstName, ...rest] = name.split(' ');
const lastName = rest.join(' ');

fs.writeFileSync(path.join(srcDir, 'main.tex'),
`\\documentclass[localFont,alternative]{documentMETADATA}
\\photo{100px}{res/my_photo.png}
\\name{${esc(firstName)}}{${esc(lastName)}}
\\tagline{${esc(role)}}
\\socialinfo{
\t\\email{${email}}\\\\
\t\\address{${esc(contacts.address)}}\\\\
\t\\website{${contacts.portfolio}}{Portfolio}
}

\\begin{document}

\t\\makecvheader

\t\\makecvfooter
\t\t{\\textsc{}}
\t\t{\\textsc{${esc(name)} - CV}}
\t\t{\\thepage}

\t\\input{sections/section_headline}        % Research Statement
\t\\input{sections/section_honors_awards}   % Section Honors and Awards
\t\\input{sections/section_experience}      % Section Professional Experience
\t\\input{sections/section_skills}          % Section Skills
\t\\input{sections/section_languages}       % Section languages
\t\\input{sections/section_interests}       % Section interests
\t\\input{sections/section_projects}        % Section Projects
\\end{document}
`);
console.log('  ✓ main.tex');

console.log('\nDone! All sections generated in latex/src/sections/');
