"use client";

import Link from "next/link";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";
import useAuth from "../app/hooks/useAuth";

const drawerWidth = 240;

export default function Sidebar() {
  const { user, logout } = useAuth();

  if (!user) return null; // 👈 Ne rien afficher si l'utilisateur n'est pas connecté

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", backgroundColor: "#f5f5f5" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItemButton component={Link} href="/with-sidebar/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard RH" />
          </ListItemButton>

          <ListItemButton component={Link} href="/with-sidebar/staff">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Gestion du staff" />
          </ListItemButton>

          <ListItemButton component={Link} href="/with-sidebar/evaluation">
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Fiche d'évaluation" />
          </ListItemButton>
        </List>

        <Divider />

        <List>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Déconnexion" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
