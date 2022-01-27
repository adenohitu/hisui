import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export function SnippetAssistantAppBar() {
  return (
    <Box>
      <AppBar sx={{ backgroundColor: "#02162E" }} position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Library Manager -Hisui Phototype-
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
