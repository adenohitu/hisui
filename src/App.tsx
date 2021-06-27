import React from "react";
import { Route, Switch, HashRouter } from "react-router-dom";
import { Menu } from "./component/menu/main";
import Window from "./component/window/dashboard/window";
import { Editor } from "./component/editor/window_editor/window";
// import { WindowSize } from "./component/window/window_editor/WindowSize";
// import { MyFirstGrid } from "./component/window/window_editor/editorwindow";
import FormDialog from "./component/auth/login_dialog";
import DefaltContest from "./component/setting/dafalt_contest";
import { Home } from "./component/home/Home";
import { Submitmain } from "./component/submit/submitwindow";
import { TestCaseBoard } from "./component/case/main";
import { BackgroungMenu } from "./component/menu/background";
import { TaskViewToolbar } from "./component/taskview/toolbar";

const App: React.FC = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/taskview" exact>
          <TaskViewToolbar />
        </Route>
        <Route path="/leftmenu" exact>
          <Menu>
            <BackgroungMenu />
          </Menu>
        </Route>
        <Route path="/" exact>
          <FormDialog />
          <DefaltContest />
          <Home />
        </Route>
        <Route path="/editor" exact>
          <DefaltContest />
          <Editor />
        </Route>
        <Route path="/submit" exact>
          <DefaltContest />
          <Submitmain />
        </Route>
        <Route path="/dashboard" exact>
          <DefaltContest />
          <Window />
        </Route>
        <Route path="/case" exact>
          <DefaltContest />
          <TestCaseBoard />
        </Route>
      </Switch>
    </HashRouter>
  );
};
export default App;
