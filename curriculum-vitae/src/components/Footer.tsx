interface FooterProps {
  linkedin: string;
  github: string;
}

export function Footer({ linkedin, github }: FooterProps) {
  return (
    <footer className="py-20 px-6 border-t border-slate-800 text-center">
      <div className="max-w-4xl mx-auto">
        <blockquote className="text-2xl font-serif italic text-slate-500 mb-4">
          "50% Lavoro, 50% Fortuna."
        </blockquote>
        <p className="mono text-sm text-slate-600 mb-12">— Shiing-Shen Chern</p>
        <div className="flex justify-center gap-8 mb-8 text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            LinkedIn
          </a>
          <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            GitHub
          </a>
        </div>
        <p className="text-xs text-slate-700 font-mono italic">
          Antonio Acquavia • {new Date().getFullYear()} • Made with Code & Curiosity
        </p>
      </div>
    </footer>
  );
}
