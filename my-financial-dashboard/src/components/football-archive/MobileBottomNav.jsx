import PropTypes from "prop-types";

const NAV_ITEMS = [
  { key: "standings", label: "Classifica", icon: "📊" },
  { key: "matches", label: "Partite", icon: "⚽" },
  { key: "participants", label: "Partecipanti", icon: "👥" },
];

export default function MobileBottomNav({ activeTab, onTabChange, isReady }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center z-50 py-2">
      {NAV_ITEMS.map((item) => {
        const active = isReady && activeTab === item.key;
        return (
          <button
            key={item.key}
            onClick={() => isReady && onTabChange(item.key)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-all ${
              !isReady ? "text-slate-700 cursor-default" : active ? "text-blue-400" : "text-slate-500 active:scale-90"
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-[9px] font-semibold mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

MobileBottomNav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  isReady: PropTypes.bool,
};
