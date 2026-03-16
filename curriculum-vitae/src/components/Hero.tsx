interface PersonalInfo {
  name: string;
  role: string;
  summary: string;
  contacts: {
    email: string;
    address: string;
    linkedin: string;
    github: string;
  };
}

interface HeroProps {
  info: PersonalInfo;
  education: Array<{ degree: string }>;
  skills: { programming: string[] };
}

export function Hero({ info, education, skills }: HeroProps) {
  const [firstName, lastName] = info.name.split(' ');

  return (
    <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-6xl font-extrabold text-white mb-6 leading-tight">
            {firstName} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
              {lastName}
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-lg">
            {info.summary}
          </p>
          <div className="flex gap-4">
            <a
              href={`mailto:${import.meta.env.VITE_CV_EMAIL || info.contacts.email}`}
              className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-sky-900/40"
            >
              Contact me
            </a>
            <div className="flex items-center gap-4 px-4 border-l border-slate-800 ml-2">
              <a
                href={info.contacts.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white cursor-pointer transition-colors uppercase text-xs font-bold tracking-widest"
              >
                LinkedIn
              </a>
              <a
                href={info.contacts.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white cursor-pointer transition-colors uppercase text-xs font-bold tracking-widest"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-slate-800/50 px-4 py-2 flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
          </div>
          <div className="p-8 mono text-sm leading-7">
            <p>
              <span className="text-purple-400">const</span>{' '}
              <span className="text-sky-400">developer</span> = {'{'}
            </p>
            <p className="pl-6">
              name: <span className="text-emerald-400">'{info.name}'</span>,
            </p>
            <p className="pl-6">
              location: <span className="text-emerald-400">'{info.contacts.address.split(',')[0]}'</span>,
            </p>
            <p className="pl-6">
              education: <span className="text-emerald-400">'{education[0].degree}'</span>,
            </p>
            <p className="pl-6">
              stack: [
              {skills.programming.slice(0, 3).map((s, i) => (
                <span key={s}>
                  <span className="text-orange-400">'{s}'</span>
                  {i < 2 ? ', ' : ''}
                </span>
              ))}
              ],
            </p>
            <p className="pl-6">
              current_focus: <span className="text-emerald-400">'{info.role}'</span>
            </p>
            <p>{'};'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
