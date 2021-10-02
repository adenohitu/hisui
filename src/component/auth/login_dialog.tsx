import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ipcRendererManager } from "../../ipc";
import { returnLogin } from "../../../src_main/interfaces";

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [username, setName] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [Login_Status, setLogin_Status] = React.useState("");

  const handleChange = (event: any) => {
    switch (event.target.name) {
      case "name":
        setName(event.target.value);
        break;
      case "pass":
        setPass(event.target.value);
        break;
      default:
        console.log("key not found");
    }
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const status: returnLogin = await ipcRendererManager.invoke("RUN_LOGIN", {
      username: username,
      password: pass,
    });
    if (status === "Failure_Postdata") {
      setLogin_Status("ユーザー名またはパスワードが間違っています");
    } else if (status === "Failure_requestError") {
      setLogin_Status("リクエストエラー");
    } else if (status === "success") {
      setLogin_Status("");
      setOpen(false);
      setName("");
      setPass("");
    }
  };
  const handleClickOpen = () => {
    ipcRendererManager.invoke("GET_LOGIN_STATUS").then((result: any) => {
      if (result === false) {
        setOpen(true);
      } else {
        console.log("already logged");
        setOpen(false);
      }
    });
  };
  useEffect(() => {
    ipcRendererManager.on("LISTENER_OPEN_LOGIN_DIALOG", handleClickOpen, true);
  }, []);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">Login Atcoder</DialogTitle>
          <DialogContent>
            <DialogContentText>AtCoderにログインします</DialogContentText>
            <DialogContentText color="error">{Login_Status}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="User Name"
              fullWidth
              type="text"
              name="name"
              value={username}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="name"
              label="Password"
              fullWidth
              type="password"
              name="pass"
              value={pass}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" value="Submit" color="primary">
              Login
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
