import PropTypes from 'prop-types';
import { useFantacalcion } from './context/FantacalcionContext';

const FORMATIONS = ['4-4-2', '4-3-3', '3-5-2', '3-4-3'];

export default function MobileFantaTopBar({ activeTab }) {
  const { formationStr, setFormationStr } = useFantacalcion();

  return (
    <header className="md:hidden h-14 shrink-0 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <span className="bg-blue-600 p-1.5 rounded-md text-white text-sm leading-none">🃏</span>
        <span className="font-bold text-white tracking-tight text-sm">Fantacalcion</span>
      </div>
      {activeTab === 'formation' && (
        <select
          value={formationStr}
          onChange={e => setFormationStr(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
        >
          {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      )}
    </header>
  );
}

MobileFantaTopBar.propTypes = {
  activeTab: PropTypes.string.isRequired,
};
