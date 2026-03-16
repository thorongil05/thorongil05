interface ProjectItem {
  name: string;
  description: string;
  tech_stack?: string[];
  link?: string;
}

interface ProjectsProps {
  projects: ProjectItem[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-16 text-center">
        Progetti
      </h2>

      <div className="space-y-12">
        {projects.map((project, index) => (
          <div
            key={index}
            className="group relative bg-slate-900/40 border border-slate-800 p-8 rounded-2xl hover:border-sky-500/50 transition-all"
          >
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">{project.name}</h3>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono text-sky-400 text-sm hover:text-sky-300 transition-colors mt-1 md:mt-0"
                >
                  {project.link} ↗
                </a>
              )}
            </div>

            <p className="text-slate-400 mb-6">{project.description}</p>

            {project.tech_stack && (
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
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
