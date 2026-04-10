import PropTypes from 'prop-types';
import { useFantacalcion } from './context/FantacalcionContext';
import StatusFooter from './StatusFooter';

const FORMATIONS = ['4-4-2', '4-3-3', '3-5-2', '3-4-3'];

const NAV_ITEMS = [
  { key: 'formation', label: 'Formazione', icon: '⚽' },
  { key: 'archive', label: 'Archivio', icon: '👥' },
];

const activeCls = 'bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold';
const idleCls = 'text-slate-400 hover:bg-slate-800 hover:text-white';

export default function FantaSidebar({ activeTab, onTabChange }) {
  const { formationStr, setFormationStr } = useFantacalcion();

  return (
    <aside className="hidden md:flex md:w-56 lg:w-64 shrink-0 h-screen bg-slate-900 border-r border-slate-800 flex-col p-4">
      <div className="flex items-center gap-3 mb-8 shrink-0">
        <span className="bg-blue-600 p-2 rounded-lg text-white text-lg leading-none shrink-0">🃏</span>
        <span className="text-xl font-bold text-white tracking-tight">
          Fanta<span className="text-blue-400">calcion</span>
        </span>
      </div>

      <div className="mb-6 shrink-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Modulo</p>
        <select
          value={formationStr}
          onChange={e => setFormationStr(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 shrink-0">Vista</p>
      <div className="shrink-0">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-all ${activeTab === item.key ? activeCls : idleCls}`}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <StatusFooter />
      </div>
    </aside>
  );
}

FantaSidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};
