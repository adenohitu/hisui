import React from "react";
import { Route, Switch, HashRouter as Router } from "react-router-dom";
import { Menu } from "./component/menu/main";
import Window from "./component/window/dashboard/window";
import { Editor } from "./component/window/window_editor/window";
// import { WindowSize } from "./component/window/window_editor/WindowSize";
// import { MyFirstGrid } from "./component/window/window_editor/editorwindow";
import FormDialog from "./component/auth/login_dialog";
import DefaltContest from "./component/setting/dafalt_contest";
import { Home } from "./component/home/Home";
import { Submitmain } from "./component/submit/submitwindow";

const App: React.FC = () => {
  return (
    <Router>
      <Menu>
        <FormDialog />
        <DefaltContest />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/editor" exact>
            <Editor />
          </Route>
          <Route path="/submit" exact>
            <Submitmain />
          </Route>
          <Route path="/dashboard" exact>
            <Window />
          </Route>
        </Switch>
      </Menu>
    </Router>
  );
};
export default App;
