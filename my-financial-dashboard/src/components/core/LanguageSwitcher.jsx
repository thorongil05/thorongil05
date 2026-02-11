import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { UserRoles } from '../../constants/roles';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  if (user?.role !== UserRoles.ADMIN) return null;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ButtonGroup size="small" variant="text" sx={{ ml: 2, border: '1px solid rgba(255,255,255,0.3)' }}>
      <Button 
        onClick={() => changeLanguage('it')}
        sx={{ 
          color: i18n.language === 'it' ? 'secondary.main' : 'white',
          fontWeight: i18n.language === 'it' ? 'bold' : 'normal'
        }}
      >
        IT
      </Button>
      <Button 
        onClick={() => changeLanguage('en')}
        sx={{ 
          color: i18n.language === 'en' ? 'secondary.main' : 'white',
          fontWeight: i18n.language === 'en' ? 'bold' : 'normal'
        }}
      >
        EN
      </Button>
    </ButtonGroup>
  );
}

export default LanguageSwitcher;
