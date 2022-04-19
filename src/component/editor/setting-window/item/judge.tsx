import { ListItem, ListItemText } from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ipcRendererManager } from "../../../../ipc";

const options = ["online", "local"];

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>ジャッジモードの設定</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="judgeMode"
          name="judgeMode"
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          キャンセル
        </Button>
        <Button onClick={handleOk}>設定</Button>
      </DialogActions>
    </Dialog>
  );
}

export function JudgeSettingDialog() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("online");

  const handleClickListItem = async () => {
    const getmode = await ipcRendererManager.invoke("GET_CODETEST_MODE");
    setValue(getmode);
    setOpen(true);
  };

  const handleClose = (newValue?: string) => {
    setOpen(false);

    if (newValue) {
      ipcRendererManager.send("SET_CODETEST_MODE", newValue);
      setValue(newValue);
    }
  };
  React.useEffect(() => {
    (async () => {
      const getmode = await ipcRendererManager.invoke("GET_CODETEST_MODE");
      setValue(getmode);
    })();
  }, []);

  return (
    <>
      <ListItem
        button
        divider
        aria-haspopup="true"
        aria-controls="judge-mode"
        aria-label="judge mode"
        onClick={handleClickListItem}
      >
        <ListItemText primary="ジャッジモード" secondary={value} />
      </ListItem>
      <ConfirmationDialogRaw
        id="judge-mode"
        keepMounted
        open={open}
        onClose={handleClose}
        value={value}
      />
    </>
  );
}
