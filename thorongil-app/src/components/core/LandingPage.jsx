import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";

const ROLE_CHIP = {
  [UserRoles.ADMIN]:  { label: "Admin",  cls: "bg-red-500/20 text-red-400 border-red-500/30" },
  [UserRoles.EDITOR]: { label: "Editor", cls: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  [UserRoles.VIEWER]: { label: "Viewer", cls: "bg-slate-700 text-slate-400 border-slate-600" },
};

const MODULES = [
  { icon: "⚽", title: "Football Archive", description: "Campionati, edizioni, fasi, gironi, partite e classifiche.", href: "/football-archive" },
  { icon: "🏆", title: "Fantacalcion", description: "Gestisci le tue squadre e segui il campionato fantasy.", href: "/fantacalcion" },
];
const ADMIN_MODULE = { icon: "🔧", title: "Admin", description: "Gestione utenti e configurazione della piattaforma.", href: "/admin" };

function RoleChip({ role }) {
  const chip = ROLE_CHIP[role] ?? { label: role, cls: "bg-slate-700 text-slate-400 border-slate-600" };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${chip.cls}`}>{chip.label}</span>;
}
RoleChip.propTypes = { role: PropTypes.string };

function LangSwitcher() {
  const { i18n } = useTranslation();
  const active = "text-blue-400 font-bold";
  const inactive = "text-slate-400 hover:text-white";
  return (
    <div className="flex items-center gap-1 text-sm border border-slate-700 rounded-lg overflow-hidden">
      {["it", "en"].map((lng) => (
        <button key={lng} onClick={() => i18n.changeLanguage(lng)} className={`px-2.5 py-1 transition-colors ${i18n.language === lng ? active : inactive}`}>
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function ModuleCard({ icon, title, description, onClick }) {
  return (
    <button onClick={onClick} className="group text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-2xl p-6 transition-all duration-200 flex flex-col gap-3 w-full">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">{title}</p>
        <p className="text-slate-400 text-sm mt-1 leading-relaxed">{description}</p>
      </div>
      <span className="text-blue-500 text-sm font-medium mt-auto">Apri →</span>
    </button>
  );
}
ModuleCard.propTypes = { icon: PropTypes.string, title: PropTypes.string, description: PropTypes.string, onClick: PropTypes.func };

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === UserRoles.ADMIN;
  const modules = isAdmin ? [...MODULES, ADMIN_MODULE] : MODULES;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <span className="text-white font-bold text-lg tracking-tight">Thorongil</span>
        <div className="flex items-center gap-3">
          {isAdmin && <LangSwitcher />}
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-slate-300 text-sm">{user.username}</span>
              <RoleChip role={user.role} />
            </div>
          )}
          {user
            ? <button onClick={logout} className="text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors">Esci</button>
            : <button onClick={() => navigate("/login")} className="text-sm text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors">Accedi</button>
          }
        </div>
      </header>
      <main className="flex-1 flex flex-col justify-center px-6 py-12 max-w-4xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Benvenuto{user ? `, ${user.username}` : ""}</h1>
          <p className="text-slate-400 mt-2">Seleziona un modulo per iniziare.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => <ModuleCard key={m.href} {...m} onClick={() => navigate(m.href)} />)}
        </div>
      </main>
    </div>
  );
}
