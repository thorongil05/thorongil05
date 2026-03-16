import PropTypes from "prop-types";
import { DropZone } from "./MatchdayDnd";

export default function MatchSlot({ index, match, onRemove }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-2.5 border border-slate-700">
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <DropZone
          id={`match-${index}-home`}
          team={match.homeTeam}
          label="CASA"
          onRemove={() => onRemove("home")}
        />
        <span className="text-xs text-slate-500 font-bold text-center sm:shrink-0">VS</span>
        <DropZone
          id={`match-${index}-away`}
          team={match.awayTeam}
          label="OSPITE"
          onRemove={() => onRemove("away")}
        />
      </div>
    </div>
  );
}

MatchSlot.propTypes = {
  index: PropTypes.number.isRequired,
  match: PropTypes.shape({
    homeTeam: PropTypes.object,
    awayTeam: PropTypes.object,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};
