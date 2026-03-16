interface NavbarProps {
  name: string;
}

export function Navbar({ name }: NavbarProps) {
  const initials = name.split(' ').map(n => n[0]).join('') + '.dev';

  return (
    <nav className="fixed w-full z-50 glass border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="mono text-sky-400 font-bold tracking-tighter text-xl">
          {initials}
        </span>
        <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-slate-400">
          <a href="#experience" className="hover:text-sky-400 transition-colors">
            Experience
          </a>
          <a href="#projects" className="hover:text-sky-400 transition-colors">
            Projects
          </a>
          <a href="#skills" className="hover:text-sky-400 transition-colors">
            Skills
          </a>
        </div>
      </div>
    </nav>
  );
}
