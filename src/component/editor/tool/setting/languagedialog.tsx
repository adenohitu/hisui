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
import { ipcRendererManager } from "../../../../ipc";
import { Checkbox } from "@mui/material";
import { languagesInfo } from "../../../../../src_main/file/extension";
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

  const langState = Uselanguage();
  const handleClose = () => {
    langState.closeDefaultChange();
    props.setOpen(false);
  };
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
                key={lang.langid}
                value={lang.langid}
                control={<Radio />}
                label={lang.langName}
              />
            ))}
          </RadioGroup>
          <SetSubmitLang />
        </DialogContent>
        <DialogActions>
          <FormControlLabel
            control={
              <Checkbox
                checked={langState.defaultChange}
                onChange={langState.handleChangeCheck}
              />
            }
            label="デフォルトの値を変更しますか？"
          />
          <Button onClick={handleClose} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Uselanguage() {
  const [langOptions, setLangOptions] = useState<
    { langName: string; langid: string }[]
  >([{ langName: "C++", langid: "cpp" }]);
  const [lang, setlang] = useState<string>("");
  const [defaultChange, setDefaultChange] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      const getlang: languagesInfo = await ipcRendererManager.invoke(
        "GET_EDITOR_LANGUAGES"
      );
      const newList = Object.keys(getlang).map((id) => {
        return { langName: getlang[id].languagename, langid: id };
      });
      setLangOptions(newList);
    })();
  }, []);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setlang((event.target as HTMLInputElement).value);
    ipcRendererManager.send(
      "SET_NOWTOP_EDITOR_LANGUAGE",
      (event.target as HTMLInputElement).value
    );
  };
  const closeDefaultChange = () => {
    if (defaultChange) {
      ipcRendererManager.send("SET_DEFAULT_LANGUAGE", lang);
    }
  };
  const handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultChange(event.target.checked);
  };
  return {
    lang,
    setlang,
    defaultChange,
    setDefaultChange,
    handleChange,
    handleChangeCheck,
    closeDefaultChange,
    langOptions,
  };
}
