import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";
import SidebarSelectors from "./SidebarSelectors";
import PropTypes from "prop-types";

const getInitials = (name) => name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 3);
const NAV_ITEMS = [
  { key: "standings", label: "Classifica", icon: "📊" },
  { key: "matches", label: "Partite", icon: "⚽" },
  { key: "participants", label: "Partecipanti", icon: "👥" },
];
const activeCls = "bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold";
const idleCls = "text-slate-400 hover:bg-slate-800 hover:text-white";

export default function ArchiveSidebar({ data, activeTab, onTabChange }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;
  const navCls = (a) => `w-full flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-3 py-2.5 rounded-lg text-sm mb-1 transition-all ${a ? activeCls : idleCls}`;
  const compCls = (a) => `w-full flex items-center justify-center lg:justify-start gap-2 px-2 lg:px-3 py-2 rounded-lg mb-0.5 transition-all ${a ? activeCls : idleCls}`;

  return (
    <aside className="hidden md:flex md:w-20 lg:w-64 shrink-0 h-screen bg-slate-900 border-r border-slate-800 flex-col p-3 lg:p-4 overflow-y-auto">
      <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
        <span className="bg-blue-500 p-2 rounded-lg text-white text-lg leading-none shrink-0">⚽</span>
        <span className="hidden lg:block text-xl font-bold text-white tracking-tight">
          Football <span className="text-blue-400">Archive</span>
        </span>
      </div>

      <p className="hidden lg:block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Campionato</p>
      <div className="space-y-0.5">
        {data.competitions.map((comp) => (
          <button key={comp.id} onClick={() => data.setSelectedCompetition(comp)} className={compCls(data.selectedCompetition?.id === comp.id)}>
            <span className="w-8 h-8 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold">
              {getInitials(comp.name)}
            </span>
            <span className="hidden lg:block text-sm truncate">{comp.name}</span>
          </button>
        ))}
        {canManage && (
          <button onClick={() => navigate("/football-archive/competition/add")} className="hidden lg:block w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors">
            + Aggiungi campionato
          </button>
        )}
      </div>

      <div className="hidden lg:block">
        <SidebarSelectors data={data} showCompetitions={false} />
      </div>

      {data.isReady && (
        <section className="mt-auto border-t border-slate-800 pt-4">
          <p className="hidden lg:block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Vista</p>
          {NAV_ITEMS.map((item) => (
            <button key={item.key} onClick={() => onTabChange(item.key)} className={navCls(activeTab === item.key)}>
              <span className="text-lg leading-none shrink-0">{item.icon}</span>
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </section>
      )}
    </aside>
  );
}

ArchiveSidebar.propTypes = {
  data: PropTypes.object.isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};
