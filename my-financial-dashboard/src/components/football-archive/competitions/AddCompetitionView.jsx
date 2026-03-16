import { Paper } from "@mui/material";
import PropTypes from "prop-types";
import CompetitionForm from "./CompetitionForm";

export default function AddCompetitionView({ onBack, onCreated }) {
  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-slate-400 hover:text-white text-xl leading-none">←</button>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Football Archive</p>
            <h1 className="text-xl font-bold text-white">Nuova Competizione</h1>
          </div>
        </div>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <CompetitionForm onSubmitSuccess={onCreated} onCancel={onBack} />
        </Paper>
      </div>
    </div>
  );
}

AddCompetitionView.propTypes = {
  onBack: PropTypes.func.isRequired,
  onCreated: PropTypes.func.isRequired,
};
