import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function CompetitionContextMenu({ x, y, comp, onClose, onEdit }) {
  const ref = useRef();

  useEffect(() => {
    const onMouse = (e) => { if (!ref.current?.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Keep menu inside viewport
  const safeX = Math.min(x, window.innerWidth - 200);
  const safeY = Math.min(y, window.innerHeight - 80);

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 min-w-[190px] text-sm"
      style={{ left: safeX, top: safeY }}
    >
      <p className="px-3 py-2 text-slate-400 text-xs font-semibold truncate border-b border-slate-700/60">
        {comp.name}
      </p>
      <button
        onClick={() => { onEdit(comp); onClose(); }}
        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:bg-slate-700/70 transition-colors"
      >
        <span className="text-slate-400">✎</span> Modifica campionato
      </button>
    </div>
  );
}

CompetitionContextMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  comp: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
