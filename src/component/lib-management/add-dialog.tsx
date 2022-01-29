import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Editor from "@monaco-editor/react";
import { useLibManagement } from "./lib-management-hooks";
import { Typography } from "@mui/material";
interface Props {
  libManagementHookProp: ReturnType<typeof useLibManagement>;
}
export const SetSnippetDialog = ({ libManagementHookProp }: Props) => {
  // 保存せずに閉じる
  const handleClose = () => {
    libManagementHookProp.setopenSettingDialogState(false);
  };
  return (
    <div>
      <Dialog
        open={libManagementHookProp.openSettingDialogState}
        onClose={handleClose}
      >
        <DialogTitle>編集ダイアログ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            スニペットの情報を入力してください
          </DialogContentText>
          <Typography>{libManagementHookProp.language}</Typography>
          <TextField
            name="title"
            margin="normal"
            label="名前(ID)"
            fullWidth
            variant="outlined"
            value={libManagementHookProp.fieldHooks.title}
            onChange={libManagementHookProp.fieldHooks.handleTextFieldChange}
            autoFocus
          />
          <TextField
            name="description"
            margin="normal"
            label="短い解説"
            fullWidth
            variant="outlined"
            value={libManagementHookProp.fieldHooks.description}
            onChange={libManagementHookProp.fieldHooks.handleTextFieldChange}
            autoFocus
          />
          <TextField
            name="prefix"
            margin="normal"
            label="補完候補文字"
            fullWidth
            variant="outlined"
            value={libManagementHookProp.fieldHooks.prefix}
            onChange={libManagementHookProp.fieldHooks.handleTextFieldChange}
            autoFocus
          />
          <Editor
            height="90vh"
            value={libManagementHookProp.fieldHooks.body}
            defaultLanguage={libManagementHookProp.language}
            onChange={libManagementHookProp.handleEditorChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>戻る</Button>
          <Button onClick={libManagementHookProp.removeSnippet}>
            削除する
          </Button>
          <Button onClick={libManagementHookProp.updateSnippet}>登録</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
