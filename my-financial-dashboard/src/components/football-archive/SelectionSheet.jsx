import { useEffect, useRef } from "react";
import { Drawer, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SidebarSelectors from "./SidebarSelectors";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../constants/roles";
import PropTypes from "prop-types";

export default function SelectionSheet({ open, onClose, data }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = user?.role === UserRoles.ADMIN || user?.role === UserRoles.EDITOR;

  const hadFalseReady = useRef(false);
  useEffect(() => {
    if (open && !data.isReady) hadFalseReady.current = true;
    if (!open) hadFalseReady.current = false;
  }, [open, data.isReady]);
  useEffect(() => {
    if (open && data.isReady && hadFalseReady.current) onClose();
  }, [data.isReady, open, onClose]);

  const handleAdd = () => { navigate("/football-archive/competition/add"); onClose(); };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "#0f172a",
          color: "white",
          maxHeight: "80vh",
          overflow: "auto",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>Seleziona</Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: "#94a3b8" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <SidebarSelectors data={data} canManage={canManage} onAddCompetition={handleAdd} />
      </Box>
    </Drawer>
  );
}

SelectionSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
