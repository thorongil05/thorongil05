import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { MATCH_DIALOG_MODE as MODE } from "./constants/matchDialogModes";

const btnCls = "w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:bg-slate-700/70 transition-colors text-sm";

export default function MatchContextMenu({ x, y, match, onClose, onEdit, onDelete }) {
  const ref = useRef();
  const [style, setStyle] = useState({ left: Math.min(x, window.innerWidth - 224), top: y, visibility: "hidden" });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    const left = Math.min(x, window.innerWidth - width - 4);
    const fitsBelow = y + height <= window.innerHeight - 8;
    const top = fitsBelow ? y : Math.max(4, y - height);
    setStyle({ left, top, visibility: "visible" });
  }, [x, y]);

  useEffect(() => {
    const onMouse = (e) => { if (!ref.current?.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onMouse); document.removeEventListener("keydown", onKey); };
  }, [onClose]);

  const label = `${match.homeTeam?.name} vs ${match.awayTeam?.name}`;
  const act = (mode) => { onEdit(match, mode); onClose(); };

  return (
    <div ref={ref} className="fixed z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 min-w-[220px]" style={style}>
      <p className="px-3 py-2 text-slate-400 text-xs font-semibold truncate border-b border-slate-700/60">{label}</p>
      <button onClick={() => act(MODE.UPDATE_SCORE)} className={btnCls}><span className="text-slate-400 w-4">⚽</span> Aggiorna risultato</button>
      <button onClick={() => act(MODE.UPDATE_TEAMS)} className={btnCls}><span className="text-slate-400 w-4">⇄</span> Modifica squadre</button>
      <button onClick={() => act(MODE.UPDATE_DATE)} className={btnCls}><span className="text-slate-400 w-4">📅</span> Modifica giornata / data</button>
      <div className="border-t border-slate-700/60 mt-1 pt-1">
        <button onClick={() => { onDelete(match.id); onClose(); }} className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-red-400 hover:bg-slate-700/70 transition-colors text-sm">
          <span className="w-4">✕</span> Elimina partita
        </button>
      </div>
    </div>
  );
}

MatchContextMenu.propTypes = {
  x: PropTypes.number.isRequired, y: PropTypes.number.isRequired, match: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired, onEdit: PropTypes.func.isRequired, onDelete: PropTypes.func.isRequired,
};
