import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@mui/material";

export function SnippetAssistantAppBar() {
  const [state, setState] = React.useState(false);
  return (
    <Box>
      <AppBar sx={{ backgroundColor: "#1E1E1E" }} position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              setState(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Library Manager -Hisui Phototype-
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={state}
        onClose={() => {
          setState(false);
        }}
      >
        <List
          sx={{
            width: "300",
            height: "100%",
            bgcolor: "background.paper",
            position: "relative",
            overflow: "auto",
            "& ul": { padding: 0 },
          }}
          subheader={<li />}
        >
          {[0, 1, 2].map((sectionId) => (
            <li key={`section-${sectionId}`}>
              <ul>
                <ListSubheader>{`準備中`}</ListSubheader>
                {[0, 1].map((item) => (
                  <ListItem key={`item-${sectionId}-${item}`}>
                    <ListItemText primary={`Item ${item}`} />
                  </ListItem>
                ))}
              </ul>
            </li>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
