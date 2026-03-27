import { useState } from 'react';
import { useFantacalcion } from './context/FantacalcionContext';
import FootballPitch from './FootballPitch';
import PlayerSelectionModal from './PlayerSelectionModal';

const BENCH_ROLES = ['DIF', 'DIF', 'CEN', 'CEN', 'ATT', 'ATT', 'ATT'];

export default function FormationBuilder() {
  const { formationStr, deployed } = useFantacalcion();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState({ id: null, role: null });

  const handleSlotClick = (slotId, requiredRole) => {
    setActiveSlot({ id: slotId, role: requiredRole });
    setModalOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center gap-4 px-3 py-4 md:py-6 bg-slate-950">
      <div className="w-full flex flex-row items-start gap-2 sm:flex-col sm:items-center">
        <div className="flex-1 min-w-0 sm:flex-none">
          <FootballPitch formation={formationStr} deployed={deployed} onSlotClick={handleSlotClick} />
        </div>
        <div className="sm:w-full sm:max-w-lg">
          <p className="text-slate-400 text-xs text-center mb-2 hidden sm:block">Panchina (7 slot: 2D, 2C, 3A)</p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:justify-center sm:p-3 sm:gap-2">
            {BENCH_ROLES.map((role, idx) => {
              const slotId = `bench-${idx}`;
              const player = deployed[slotId];
              return (
                <button
                  key={slotId}
                  onClick={() => handleSlotClick(slotId, role)}
                  className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    player
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-800 border-slate-700 border-dashed text-slate-400 hover:border-blue-500'
                  }`}
                >
                  <span className="font-bold text-[9px] sm:text-xs">{player ? player.name.substring(0, 6) : role}</span>
                  <span className="text-[8px] sm:text-[10px]">{player ? player.team_name.substring(0, 3).toUpperCase() : `P${idx + 1}`}</span>
                </button>
              );
            })}
          </div>
          <p className="text-slate-500 text-xs text-center mt-1 hidden sm:block">Clicca per aggiungere (2 DIF, 2 CEN, 3 ATT)</p>
        </div>
      </div>

      <PlayerSelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        slotId={activeSlot.id}
        requiredRole={activeSlot.role}
      />
    </div>
  );
}
