import { useState, useCallback } from "react";
import { useArchiveData } from "./hooks/useArchiveData";
import ArchiveSidebar from "./ArchiveSidebar";
import ArchiveContent from "./ArchiveContent";
import MobileTopBar from "./MobileTopBar";
import MobileBottomNav from "./MobileBottomNav";
import SelectionSheet from "./SelectionSheet";

export default function FootballArchiveLayout() {
  const data = useArchiveData();
  const [activeTab, setActiveTab] = useState("standings");
  const [sheetOpen, setSheetOpen] = useState(false);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 overflow-hidden">
      <MobileTopBar data={data} onOpenSheet={() => setSheetOpen(true)} />
      <ArchiveSidebar data={data} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto bg-slate-950 pb-20 md:pb-0">
        <ArchiveContent data={data} activeTab={activeTab} />
      </main>
      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} isReady={data.isReady} />
      <SelectionSheet open={sheetOpen} onClose={closeSheet} data={data} />
    </div>
  );
}
