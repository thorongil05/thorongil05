import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";
import { Button } from "@mui/material";

const navigation = [
  {
    id: "item-1",
    name: "Football Archive",
    href: "/football-archive",
  },
  {
    id: "item-2",
    name: "Admin",
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

import Stack from "@mui/material/Stack";

export default function Navbar() {
  const [navigationItems, setNavigationItems] = useState(navigation);
  const { user, logout } = useAuth();
  let navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 0, height: "60px" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {navigation
            .filter((item) => {
              if (item.id === "item-4" && !user) return false;
              if (item.role && user?.role !== item.role) return false;
              return true;
            })
            .map((element) => {
              return (
                <MenuItem
                  key={element.id}
                  onClick={() => {
                    navigate(element.href);
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {element.name}
                  </Typography>
                </MenuItem>
              );
            })}
          <Box sx={{ flexGrow: 1 }} />
          {user ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </Stack>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
