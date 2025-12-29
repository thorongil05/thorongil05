import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router";
import { useState } from "react";

const navigation = [
  { id: "item-1", name: "BONDs", href: "/bonds", current: false },
  { id: "item-2", name: "Mortgages", href: "/mortgages", current: false },
  { id: "item-3", name: "Real Estates", href: "/real-estates", current: false },
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
  const [navigationItems, setNavigationItems] = useState(navigation);
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
          {navigationItems.map((element) => {
            return (
              <MenuItem
                key={element.id}
                selected={element.current}
                onClick={() => {
                  navigate(element.href);
                  let updatedNavigationItems = updateNavigationItems(
                    element,
                    navigationItems
                  );
                  setNavigationItems(updatedNavigationItems);
                }}
              >
                <Typography sx={{ textAlign: "center" }}>
                  {element.name}
                </Typography>
              </MenuItem>
            );
          })}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
