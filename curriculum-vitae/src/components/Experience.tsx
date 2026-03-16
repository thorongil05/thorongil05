interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description?: string;
  highlights?: string;
  tech_stack?: string[];
  publication?: { title: string; venue: string; url: string };
}

interface ExperienceProps {
  experience: ExperienceItem[];
}

export function Experience({ experience }: ExperienceProps) {
  return (
    <section id="experience" className="py-24 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-16 text-center">
        Work Experience
      </h2>

      <div className="space-y-12">
        {experience.map((exp, index) => (
          <div
            key={index}
            className="group relative bg-slate-900/40 border border-slate-800 p-8 rounded-2xl hover:border-sky-500/50 transition-all"
          >
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
                <p className="text-sky-400 font-semibold uppercase tracking-wider text-sm">
                  {exp.company}
                </p>
              </div>
              <span className="mono text-slate-500 text-sm">{exp.period}</span>
            </div>
            
            <p className="text-slate-400 mb-6">
              {exp.description || exp.highlights}
            </p>
            
            {exp.publication && (
              <a
                href={exp.publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mb-6 text-sm text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>📄</span>
                <span className="italic">{exp.publication.title}</span>
                <span className="text-slate-500">— {exp.publication.venue} ↗</span>
              </a>
            )}
            {exp.tech_stack && (
              <div className="flex flex-wrap gap-2">
                {exp.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="bg-slate-800 px-3 py-1 rounded text-xs mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
