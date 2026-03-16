import PropTypes from 'prop-types';

const NAV_ITEMS = [
  { key: 'formation', label: 'Formazione', icon: '⚽' },
  { key: 'archive', label: 'Archivio', icon: '👥' },
  { key: 'status', label: 'Stato', icon: '📊' },
];

export default function MobileFantaBottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center z-50 py-2">
      {NAV_ITEMS.map(item => (
        <button
          key={item.key}
          onClick={() => onTabChange(item.key)}
          className={`flex flex-col items-center gap-0.5 px-6 py-1 transition-all ${
            activeTab === item.key ? 'text-blue-400' : 'text-slate-500 active:scale-90'
          }`}
        >
          <span className="text-xl leading-none">{item.icon}</span>
          <span className="text-[9px] font-semibold mt-0.5">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

MobileFantaBottomNav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};
