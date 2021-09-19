import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ipcRendererManager } from "../../ipc";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  })
);

export function HomeMenu() {
  const classes = useStyles();
  const [loginStatus, setloginStatus] = useState<boolean>(false);
  const getLoginStatus = async () => {
    const status = await ipcRendererManager.invoke("GET_LOGIN_STATUS");
    setloginStatus(status);
  };
  useEffect(() => {
    getLoginStatus();
  }, []);
  return (
    <div>
      {loginStatus === false && (
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={() => {
            ipcRendererManager.send("OPEN_LOGIN_DIALOG");
          }}
        >
          ログインする
        </Button>
      )}
      {loginStatus === true && (
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={() => {
            ipcRendererManager.send("OPEN_SELECT_CONTEST_DIALOG");
          }}
        >
          コンテストを選択する
        </Button>
      )}
    </div>
  );
}
