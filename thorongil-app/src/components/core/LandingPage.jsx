import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";

const MODULES = [
  {
    icon: "⚽",
    title: "Football Archive",
    description: "Campionati, edizioni, fasi, gironi, partite e classifiche.",
    href: "/football-archive",
  },
  {
    icon: "🏆",
    title: "Fantacalcion",
    description: "Gestisci le tue squadre e segui il campionato fantasy.",
    href: "/fantacalcion",
  },
];

const ADMIN_MODULE = {
  icon: "🔧",
  title: "Admin",
  description: "Gestione utenti e configurazione della piattaforma.",
  href: "/admin",
};

function ModuleCard({ icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-2xl p-6 transition-all duration-200 flex flex-col gap-3 w-full"
    >
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
  const { user } = useAuth();
  const isAdmin = user?.role === UserRoles.ADMIN;

  const modules = isAdmin ? [...MODULES, ADMIN_MODULE] : MODULES;

  return (
    <div className="min-h-[60vh] flex flex-col justify-center py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Benvenuto{user ? `, ${user.username}` : ""}</h1>
        <p className="text-slate-400 mt-2">Seleziona un modulo per iniziare.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => (
          <ModuleCard key={m.href} {...m} onClick={() => navigate(m.href)} />
        ))}
      </div>
    </div>
  );
}
