import PropTypes from 'prop-types';

export default function PlayerTable({ players, page, pageSize, totalCount, onPageChange, onEdit, onDelete }) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-4">
      <table className="w-full text-sm">
        <thead className="bg-slate-800">
          <tr>
            <th className="text-left px-4 py-3 text-slate-300 font-semibold">Nome</th>
            <th className="text-left px-4 py-3 text-slate-300 font-semibold hidden sm:table-cell">Squadra</th>
            <th className="text-left px-4 py-3 text-slate-300 font-semibold">Ruolo</th>
            <th className="text-right px-4 py-3 text-slate-300 font-semibold">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {players.map(p => (
            <tr key={p.id} className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors">
              <td className="px-4 py-3 text-white">
                {p.name}
                <span className="block sm:hidden text-xs text-slate-500">{p.team_name}</span>
              </td>
              <td className="px-4 py-3 text-slate-300 hidden sm:table-cell">{p.team_name}</td>
              <td className="px-4 py-3">
                <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs font-medium">{p.role}</span>
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <button onClick={() => onEdit(p)} className="text-slate-400 hover:text-blue-400 transition-colors mr-3 text-xs">✎</button>
                <button onClick={() => onDelete(p.id)} className="text-slate-400 hover:text-red-400 transition-colors text-xs">✕</button>
              </td>
            </tr>
          ))}
          {players.length === 0 && (
            <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Nessun giocatore trovato</td></tr>
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
          <span className="text-slate-500 text-xs">{totalCount} giocatori</span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`w-7 h-7 rounded text-xs transition-colors ${page === i ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

PlayerTable.propTypes = {
  players: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
