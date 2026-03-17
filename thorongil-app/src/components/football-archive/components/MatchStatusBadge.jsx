import PropTypes from "prop-types";

const STATUS_STYLE = {
  SCHEDULED:   { label: "Programmata", cls: "bg-slate-700 text-slate-300" },
  IN_PROGRESS: { label: "In corso",    cls: "bg-yellow-500/20 text-yellow-400" },
  SUSPENDED:   { label: "Sospesa",     cls: "bg-orange-500/20 text-orange-400" },
  POSTPONED:   { label: "Rinviata",    cls: "bg-blue-500/20 text-blue-400" },
  CANCELLED:   { label: "Annullata",   cls: "bg-red-500/20 text-red-400" },
  FORFEITED:   { label: "Tavolino",    cls: "bg-purple-500/20 text-purple-400" },
};

export function MatchStatusBadge({ status }) {
  if (!status || status === "COMPLETED") return null;
  const s = STATUS_STYLE[status] ?? { label: status, cls: "bg-slate-700 text-slate-400" };
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${s.cls}`}>
      {s.label}
    </span>
  );
}


MatchStatusBadge.propTypes = {
  status: PropTypes.string,
};
