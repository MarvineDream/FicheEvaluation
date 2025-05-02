// src/app/(with-sidebar)/layout.js
"use client";

import Sidebar from "@/components/sidebar";
import { CssBaseline, Box } from "@mui/material";

export default function WithSidebarLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
