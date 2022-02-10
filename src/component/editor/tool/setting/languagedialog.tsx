import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { monacoControlApi } from "../../editor";
import { SetSubmitLang } from "./set-submitlang";
export let handleClickOpenSelectLanguageDialog: () => void;
interface SelectLanguageDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function SelectLanguageDialog(props: SelectLanguageDialogProps) {
  handleClickOpenSelectLanguageDialog = () => {
    updateNowLang();
    props.setOpen(true);
  };
  const updateNowLang = () => {
    const langp = monacoControlApi?.getNowModelLang();
    if (langp) langState.setlang(langp);
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
          <SetSubmitLang />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            閉じる
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
    window.editor.setdefaultLanguage(event.target.value, true);
  };
  return { lang, setlang, handleChange, langOptions };
}
