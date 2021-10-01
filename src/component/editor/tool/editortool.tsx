import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ipcRendererManager } from "../../../ipc";
import { monacoControlApi } from "../editor";
export const EditorTool = () => {
  const [lang, setlang] = useState("cpp");
  // defaultlanguageを取得
  useEffect(() => {
    async function fetchData() {
      const defaultlang = await window.editor.getdefaultLanguage();
      setlang(defaultlang);
    }
    fetchData();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setlang((event.target as HTMLInputElement).value);
  };
  return (
    <Container>
      <Grid item xs={12} md={8} lg={9}>
        <FormControl style={{ width: "100%" }}>
          <InputLabel id="case-select">言語</InputLabel>
          <Select
            labelId="case-select-label"
            id="case-select"
            value={lang}
            onChange={handleChange}
          >
            <MenuItem value={"cpp"}>cpp</MenuItem>
            <MenuItem value={"python"}>python</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Box pt={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.editor.setdefaultLanguage(lang, true);
            }}
          >
            言語変更
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Box pt={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              monacoControlApi?.saveNowValue();
            }}
          >
            save
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Box pt={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.editor.submitNowTop();
            }}
          >
            提出する
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Box pt={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              ipcRendererManager.send("RUN_UPDATE_SUBMISSIONS");
            }}
          >
            提出一覧を更新
          </Button>
        </Box>
      </Grid>
    </Container>
  );
};
