import { useState } from "react";
import { useArchiveData } from "./hooks/useArchiveData";
import ArchiveSidebar from "./ArchiveSidebar";
import ArchiveContent from "./ArchiveContent";

export default function FootballArchiveLayout() {
  const data = useArchiveData();
  const [activeTab, setActiveTab] = useState("standings");

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <ArchiveSidebar data={data} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto bg-white text-slate-900">
        <ArchiveContent data={data} activeTab={activeTab} />
      </main>
    </div>
  );
}
