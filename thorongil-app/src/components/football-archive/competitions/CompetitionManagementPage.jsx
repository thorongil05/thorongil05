import { useParams, useNavigate } from "react-router";
import AddCompetitionView from "./AddCompetitionView";
import CompetitionDetailPage from "./CompetitionDetailPage";

export default function CompetitionManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const back = () => navigate("/football-archive");

  if (!id) {
    return (
      <AddCompetitionView
        onBack={back}
        onCreated={(newId) => navigate(`/football-archive/competition/edit/${newId}`)}
      />
    );
  }

  return <CompetitionDetailPage id={parseInt(id)} onBack={back} />;
}
