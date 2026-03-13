interface SkillsProps {
  skills: {
    programming: string[];
    frameworks: string[];
    cloud: string[];
    databases: string[];
    soft_skills: string[];
  };
}

export function Skills({ skills }: SkillsProps) {
  const categories = [
    { title: 'Programming', items: skills.programming },
    { title: 'Frameworks', items: skills.frameworks },
    { title: 'Cloud & DBs', items: [...skills.cloud, ...skills.databases] },
    { title: 'Soft Skills', items: skills.soft_skills }
  ];

  return (
    <section id="skills" className="py-24 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-16 text-center">
        Competenze Tecniche
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl border-t-2 border-t-sky-500">
            <h3 className="text-white font-bold mb-6 tracking-wide">{cat.title}</h3>
            <ul className="space-y-3">
              {cat.items.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
