import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function FormDialog() {
  const [open_snack, setOpen_snack] = React.useState(false);
  const [status_snack, setStatus_snack] = React.useState("");
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
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const login: any = window.api.login_render;
    login({
      username: username,
      password: pass,
    }).then((result: any) => {
      console.log(result);
      if (result === "Failure_Postdata") {
        setLogin_Status("ユーザー名またはパスワードが間違っています");
      } else if (result === "Failure_Postdata") {
        setLogin_Status("リクエストエラー");
      } else if (result === "success") {
        setLogin_Status("");
        setOpen(false);
        setStatus_snack(`${username}でログインしました`);
        setName("");
        setPass("");
        setOpen_snack(true);
      }
    });
  };
  const handleClickOpen = () => {
    window.api.get_login_status_render().then((result: any) => {
      if (result === false) {
        setOpen(true);
      } else {
        console.log("already logged");

        setOpen(false);
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose_snack = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen_snack(false);
  };
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        login
      </Button>
      <Snackbar
        open={open_snack}
        autoHideDuration={6000}
        onClose={handleClose_snack}
      >
        <Alert onClose={handleClose_snack} severity="success">
          {status_snack}
        </Alert>
      </Snackbar>
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
