"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";
import useAuth from "../app/hooks/useAuth";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 240;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!user) return null;

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Toolbar />

        {/* Logo Bamboo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, width: '100%' }}>
          <Image 
            src="/logo-bamboo.svg" 
            alt="Logo Bamboo" 
            width={240} 
            height={80} 
            style={{ width: '80%', height: 'auto' }} 
            priority
          />
        </Box>

        <Box sx={{ px: 2, pb: 1, mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Connecté en tant que :
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {user.nom} ({user.role})
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <List>
          {(user.role === "RH" || user.role === "admin") && (
            <ListItemButton component={Link} href="/with-sidebar/dashboard">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Tableau de bord Responsable RH" />
            </ListItemButton>
          )}

          {user.role === "Manager" && (
            <ListItemButton component={Link} href="/with-sidebar/manager-dashboard">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Tableau de bord Manager" />
            </ListItemButton>
          )}
          {(user.role === "RH" || user.role === "admin") && (
            <ListItemButton component={Link} href="/with-sidebar/departement">
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Departement" />
            </ListItemButton>
          )}

          <ListItemButton component={Link} href="/with-sidebar/staff">
  <ListItemIcon>
    <PeopleIcon />
  </ListItemIcon>
  <ListItemText
    primary={
      user.role === "Manager"
        ? "Équipe et évaluation"
        : "Gestion du personnel et évaluation"
    }
  />
</ListItemButton>


          
        </List>
      </Box>

      <Box>
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
    </Box>
  );


  

  return (
    <>
      {/* Menu burger pour mobile */} 
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1201,
            backgroundColor: "#fff",
            width: "100%",
            boxShadow: 1,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ m: 1 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* Drawer mobile */} 
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer desktop */} 
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
