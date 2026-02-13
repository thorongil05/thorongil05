import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router";
import { useState } from "react";
import { 
  Button, 
  Stack, 
  Collapse, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemButton,
  useTheme,
  useMediaQuery,
  Divider
} from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";

const navigation = [
  {
    id: "item-1",
    name: "Football Archive",
    i18nKey: "nav.football_archive",
    href: "/football-archive",
  },
  {
    id: "item-2",
    name: "Admin",
    i18nKey: "nav.admin",
    href: "/admin",
    role: UserRoles.ADMIN
  }
];

function updateNavigationItems(selectedElement, elements) {
  elements.map((element) => {
    if (element.id == selectedElement.id) {
      element.current = true;
    } else {
      element.current = false;
    }
  });
  return elements;
}

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = navigation.filter((item) => {
    if (item.role && user?.role !== item.role) return false;
    return true;
  });

  const handleNavClick = (href) => {
    navigate(href);
    if (mobileOpen) setMobileOpen(false);
  };

  const menuContent = (
    <Box sx={{ pb: 2 }}>
      <Divider sx={{ mb: 1, borderColor: "rgba(255,255,255,0.12)" }} />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton onClick={() => handleNavClick(item.href)}>
              <ListItemText 
                primary={t(item.i18nKey)} 
                primaryTypographyProps={{ sx: { fontWeight: "medium" } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.12)" }} />
        <ListItem>
          <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
               <LanguageSwitcher />
            </Box>
            {user ? (
              <Button variant="outlined" color="inherit" onClick={logout} fullWidth>
                {t("nav.logout")}
              </Button>
            ) : (
              <Button variant="outlined" color="inherit" onClick={() => handleNavClick("/login")} fullWidth>
                {t("nav.login")}
              </Button>
            )}
          </Stack>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 0 }}>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              cursor: "pointer", 
              mr: 4,
              fontWeight: "bold"
            }}
            onClick={() => navigate("/")}
          >
            Thorongil
          </Typography>

          {!isMobile && (
            <Stack direction="row" spacing={1}>
              {navItems.map((element) => (
                <MenuItem
                  key={element.id}
                  onClick={() => handleNavClick(element.href)}
                  sx={{ borderRadius: 1 }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {t(element.i18nKey)}
                  </Typography>
                </MenuItem>
              ))}
            </Stack>
          )}

          <Box sx={{ flexGrow: 1 }} />
          
          {!isMobile && (
            <Stack direction="row" spacing={2} alignItems="center">
              <LanguageSwitcher />
              {user ? (
                <Button color="inherit" onClick={logout}>
                  {t("nav.logout")}
                </Button>
              ) : (
                <Button color="inherit" onClick={() => navigate("/login")}>
                  {t("nav.login")}
                </Button>
              )}
            </Stack>
          )}
        </Toolbar>
        
        {isMobile && (
          <Collapse in={mobileOpen} timeout="auto" unmountOnExit>
            {menuContent}
          </Collapse>
        )}
      </AppBar>
    </Box>
  );
}
