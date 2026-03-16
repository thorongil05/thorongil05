import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { FantacalcionProvider } from './context/FantacalcionContext';
import PlayerArchive from './PlayerArchive';
import FormationBuilder from './FormationBuilder';

export default function FantacalcionLayout() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <FantacalcionProvider>
      <Box sx={{ width: '100%', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Formazione" />
            <Tab label="Archivio Giocatori" />
          </Tabs>
        </Box>
        
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {tabIndex === 0 && <FormationBuilder />}
          {tabIndex === 1 && <PlayerArchive />}
        </Box>
      </Box>
    </FantacalcionProvider>
  );
}
