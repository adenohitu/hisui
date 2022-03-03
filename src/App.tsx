import React, { useEffect } from "react";
import { Route, Switch, HashRouter } from "react-router-dom";
import { Menu } from "./component/menu/main";
import Window from "./component/dashboard/window";
import { Editor } from "./component/editor/main";
// import { WindowSize } from "./component/window/window_editor/WindowSize";
// import { MyFirstGrid } from "./component/window/window_editor/editorwindow";
import FormDialog from "./component/auth/login_dialog";
import DefaltContest from "./component/setting/dafalt_contest";
import { Home } from "./component/home/Home";
import { TestCaseBoard } from "./component/case/main";
import { BackgroungMenu } from "./component/menu/background";
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
            <Route path="/leftmenu" exact>
              <Menu>
                <Editor />
              </Menu>
            </Route>
            <Route path="/taskview" exact>
              <TaskViewToolbar />
            </Route>
            <Route path="/" exact>
              <FormDialog />
              <DefaltContest />
              <Home />
            </Route>
            <Route path="/editor" exact>
              <Editor />
            </Route>
            <Route path="/dashboard" exact>
              <Window />
            </Route>
            <Route path="/case" exact>
              <TestCaseBoard />
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
