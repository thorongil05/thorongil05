import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";
import SidebarSelectors from "./SidebarSelectors";
import PropTypes from "prop-types";

const NAV_ITEMS = [
  { key: "standings", label: "Classifica" },
  { key: "matches", label: "Partite" },
  { key: "participants", label: "Partecipanti" },
];

export default function ArchiveSidebar({ data, activeTab, onTabChange }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;

  const navBtnCls = (active) =>
    `w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 transition-all ${
      active
        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 shrink-0 h-screen bg-slate-900 border-r border-slate-800 flex flex-col p-4 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <span className="bg-blue-500 p-2 rounded-lg text-white text-lg leading-none">⚽</span>
        <span className="text-xl font-bold text-white tracking-tight">
          Football <span className="text-blue-400">Archive</span>
        </span>
      </div>

      <SidebarSelectors
        data={data}
        canManage={canManage}
        onAddCompetition={() => navigate("/football-archive/competition/add")}
      />

      {data.isReady && (
        <section className="mt-6 border-t border-slate-800 pt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Vista</p>
          {NAV_ITEMS.map((item) => (
            <button key={item.key} onClick={() => onTabChange(item.key)} className={navBtnCls(activeTab === item.key)}>
              {item.label}
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
