import PropTypes from "prop-types";

export function ScoreSelector({ value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, (value ?? 0) - 1))}
        disabled={disabled || (value ?? 0) <= 0}
        className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 active:scale-95 disabled:opacity-30 text-white text-2xl font-bold transition-all flex items-center justify-center select-none"
      >
        −
      </button>
      <span className="w-10 text-center text-4xl font-bold text-white tabular-nums leading-none">
        {value ?? "—"}
      </span>
      <button
        type="button"
        onClick={() => onChange(value != null ? value + 1 : 0)}
        disabled={disabled}
        className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 active:scale-95 disabled:opacity-30 text-white text-2xl font-bold transition-all flex items-center justify-center select-none"
      >
        +
      </button>
    </div>
  );
}

ScoreSelector.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
