interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  mark?: string;
  highlights?: string;
}

interface EducationProps {
  education: EducationItem[];
}

export function Education({ education }: EducationProps) {
  return (
    <section id="education" className="py-24 px-6 bg-[#0d1526]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-16">
          Formazione
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {education.map((edu, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col h-full">
              <h4 className="text-lg font-bold text-white mb-3 leading-tight">{edu.degree}</h4>
              <p className="text-sm text-sky-400 font-semibold uppercase tracking-wider mb-2">
                {edu.institution}
              </p>
              <p className="text-xs text-slate-500 mono mb-4">{edu.period}</p>
              
              <p className="text-sm text-slate-400 mb-6 flex-grow">
                {edu.highlights || 'Percorso di studi completato con successo.'}
              </p>
              
              {edu.mark && (
                <div className="flex gap-2 mb-4 mt-auto">
                  <span className="text-[10px] bg-sky-900/30 text-sky-400 px-2 py-1 rounded">
                    Voto: {edu.mark.replace(/\$/g, '')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
