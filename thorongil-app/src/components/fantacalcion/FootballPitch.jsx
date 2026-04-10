import PropTypes from 'prop-types';

const FORMATION_MAP = {
  '4-4-2': [1, 4, 4, 2],
  '4-3-3': [1, 4, 3, 3],
  '3-5-2': [1, 3, 5, 2],
  '3-4-3': [1, 3, 4, 3],
};

function getRoleForLine(lineIndex, totalLines) {
  if (lineIndex === 0) return 'POR';
  if (lineIndex === 1) return 'DIF';
  if (lineIndex === totalLines - 1) return 'ATT';
  return 'CEN';
}

function PlayerSlot({ slotId, player, role, onClick }) {
  return (
    <button onClick={() => onClick(slotId, role)} className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm ${player ? 'bg-blue-600 shadow-lg' : 'bg-white/20'}`}>
        {player ? player.role.charAt(0) : '+'}
      </div>
      <span className="text-white text-[10px] sm:text-xs bg-black/60 px-1.5 py-0.5 rounded whitespace-nowrap font-medium">
        {player ? player.name.split(' ')[0] : role}
      </span>
    </button>
  );
}

export default function FootballPitch({ formation, deployed, onSlotClick }) {
  const lines = FORMATION_MAP[formation] || FORMATION_MAP['4-4-2'];
  let slotCounter = 0;

  return (
    <div
      className="relative w-full max-w-[320px] sm:max-w-sm mx-auto bg-green-800 border-2 border-white rounded-xl flex flex-col justify-between p-3 sm:p-4"
      style={{ aspectRatio: '0.75', backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '100% 10%' }}
    >
      <div className="absolute top-0 left-[20%] right-[20%] h-[15%] border-2 border-white/30 border-t-0" />
      <div className="absolute bottom-0 left-[20%] right-[20%] h-[15%] border-2 border-white/30 border-b-0" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-white/30" />
      {lines.map((pCount, lineIdx) => {
        const role = getRoleForLine(lineIdx, lines.length);
        return (
          <div key={lineIdx} className="flex justify-center gap-1 sm:gap-4 z-10">
            {Array.from({ length: pCount }).map(() => {
              const slotId = `starter-${slotCounter++}`;
              return <PlayerSlot key={slotId} slotId={slotId} player={deployed[slotId]} role={role} onClick={onSlotClick} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

FootballPitch.propTypes = {
  formation: PropTypes.string.isRequired,
  deployed: PropTypes.object.isRequired,
  onSlotClick: PropTypes.func.isRequired,
};

PlayerSlot.propTypes = {
  slotId: PropTypes.string.isRequired,
  player: PropTypes.object,
  role: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
