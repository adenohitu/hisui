import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { Alert, ListItem, ListItemText, Snackbar } from "@mui/material";
import Editor, { Monaco } from "@monaco-editor/react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { editor } from "monaco-editor";
import { languagetype } from "../../../../../src_main/file/extension";
import { ipcRendererManager } from "../../../../ipc";
export function SnippetDialog() {
  const editorRef: any = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [language, setLanguage] = React.useState<languagetype>("cpp");
  const [value, setValue] = React.useState<string>("");

  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      allowComments: true,
      trailingCommas: "error",
    });
  }

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
  }
  function handleEditorChange(
    value: string | undefined,
    ev: editor.IModelContentChangedEvent
  ) {
    if (value) {
      setValue(value);
    }
  }

  const handleChangeLang = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as languagetype);
    (async () => {
      const Data = await ipcRendererManager.invoke(
        "GET_LANG_SNIPPET",
        event.target.value
      );
      setValue(Data);
    })();
  };

  const handleClickOpen = () => {
    (async () => {
      const Data = await ipcRendererManager.invoke(
        "GET_LANG_SNIPPET",
        language
      );
      setValue(Data);
    })();
    setOpen(true);
  };

  const saveClose = () => {
    (async () => {
      const result = await ipcRendererManager.invoke(
        "SET_LANG_SNIPPET",
        language,
        value
      );
      if (result === "Success") {
        setOpenAlert(false);
        setOpen(false);
      } else {
        setOpenAlert(true);
      }
    })();
  };

  return (
    <>
      <ListItem button onClick={handleClickOpen}>
        <ListItemText
          primary="スニペットの設定"
          secondary="言語ごとのスニペットの設定"
        />
      </ListItem>
      <Dialog
        scroll="body"
        fullWidth={true}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>スニペットの設定</DialogTitle>
        <Box width="40px">
          <FormControl sx={{ width: "100px" }}>
            <InputLabel>言語</InputLabel>
            <Select
              value={language}
              label="language"
              onChange={handleChangeLang}
            >
              <MenuItem value={"cpp"}>C++</MenuItem>
              <MenuItem value={"python"}>Python</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Editor
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          height="600px"
          language="json"
          value={value}
          onChange={handleEditorChange}
        />
        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={() => {
            setOpenAlert(false);
          }}
        >
          <Alert
            onClose={() => {
              setOpenAlert(false);
            }}
            severity="error"
            sx={{ width: "100%" }}
          >
            エラー:文法を間違えている可能性があります
          </Alert>
        </Snackbar>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            キャンセル
          </Button>
          <Button onClick={saveClose}>保存</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
