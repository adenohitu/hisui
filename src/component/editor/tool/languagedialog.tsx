import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

interface SelectLanguageDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function SelectLanguageDialog(props: SelectLanguageDialogProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClickOpen = () => {
    props.setOpen(true);
  };

  const handleClose = () => {
    props.setOpen(false);
  };
  const langState = Uselanguage();

  return (
    <div>
      <Dialog
        fullWidth={true}
        open={props.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">言語</DialogTitle>
        <DialogContent>
          <DialogContentText>言語を選択</DialogContentText>
          <RadioGroup
            aria-label="select-lang"
            name="lang"
            value={langState.lang}
            onChange={langState.handleChange}
          >
            {langState.langOptions.map((lang) => (
              <FormControlLabel
                key={lang}
                value={lang}
                control={<Radio />}
                label={lang}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
              langState.handleOk();
            }}
            color="primary"
          >
            変更
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Uselanguage() {
  const langOptions = ["cpp", "python"];

  const [lang, setlang] = useState<string>("");
  useEffect(() => {
    async function fetchData() {
      const defaultlang = await window.editor.getdefaultLanguage();
      setlang(defaultlang);
    }
    fetchData();
  }, []);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setlang((event.target as HTMLInputElement).value);
  };
  const handleOk = () => {
    window.editor.setdefaultLanguage(lang, true);
  };
  return { lang, setlang, handleChange, langOptions, handleOk };
}
