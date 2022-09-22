import React, { useEffect } from "react";
import { Route, Switch, HashRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { WindowRoot } from "./component/menu/main";
import { TaskViewToolbar } from "./component/taskview/toolbar";
import "@fontsource/roboto";
import "./style/mosaic.css";
import {
  ThemeProvider,
  Theme,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import { ipcRendererManager } from "./ipc";
import { LibManagement } from "./component/lib-management/main";
import { SnackbarProvider } from "notistack";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const theme = createTheme();

const App: React.FC = () => {
  useEffect(() => {
    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      ipcRendererManager.send("OPEN_CONTEXT_MENU");
    });
  }, []);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <HashRouter>
          <Switch>
            <Route path="/mainwindow-root" exact>
              <RecoilRoot>
                <SnackbarProvider>
                  <WindowRoot />
                </SnackbarProvider>
              </RecoilRoot>
            </Route>
            <Route path="/taskview" exact>
              <TaskViewToolbar />
            </Route>
            <Route path="/lib-management" exact>
              <LibManagement />
            </Route>
          </Switch>
        </HashRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
export default App;
