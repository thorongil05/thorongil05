import { useState } from 'react';
import { FantacalcionProvider } from './context/FantacalcionContext';
import FantaSidebar from './FantaSidebar';
import MobileFantaTopBar from './MobileFantaTopBar';
import MobileFantaBottomNav from './MobileFantaBottomNav';
import FormationBuilder from './FormationBuilder';
import PlayerArchive from './PlayerArchive';
import StatusFooter from './StatusFooter';

export default function FantacalcionLayout() {
  const [activeTab, setActiveTab] = useState('formation');

  return (
    <FantacalcionProvider>
      <div className="flex flex-col md:flex-row h-screen bg-slate-950 overflow-hidden">
        <MobileFantaTopBar activeTab={activeTab} />
        <FantaSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-hidden flex flex-col bg-slate-950 pb-14 md:pb-0">
          {activeTab === 'formation' && <FormationBuilder />}
          {activeTab === 'archive' && <PlayerArchive />}
          {activeTab === 'status' && (
            <div className="p-4 overflow-y-auto flex-1">
              <StatusFooter />
            </div>
          )}
        </main>
        <MobileFantaBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </FantacalcionProvider>
  );
}
