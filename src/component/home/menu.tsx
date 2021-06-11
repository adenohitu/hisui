import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

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
    const status = await window.api.get_login_status_render();
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
            window.api.openLoginDialog();
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
            window.api.openselectDafaultcontest();
          }}
        >
          コンテストを選択する
        </Button>
      )}
    </div>
  );
}
