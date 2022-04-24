import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ipcRendererManager } from "../../../../ipc";
import {
  scrapingLangReturn,
  submitLanguage,
} from "../../../../../src_main/data/scraping/submitlang";

export function SetSubmitLang() {
  const submitLangHook = Uselanguage();

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">SubmitLanguage</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={submitLangHook.submitLangState}
          label="SubmitLanguage"
          onChange={submitLangHook.handleChange}
        >
          {submitLangHook.submitLangList.map((arg, indexid) => (
            <MenuItem key={indexid} value={indexid}>
              {arg.Languagename}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
function Uselanguage() {
  const [submitLangList, setSubmitLangList] = React.useState<submitLanguage[]>(
    []
  );

  const [submitLangState, setSubmitLangState] = React.useState("");

  React.useEffect(() => {
    async function fetchData() {
      const nowContest = await ipcRendererManager.invoke("GET_SET_CONTESTID");
      const list: scrapingLangReturn[] = await ipcRendererManager.invoke(
        "GET_SUBMIT_LANGUAGE_LIST",
        nowContest
      );
      setSubmitLangList(list[0].submitlangList);
    }
    fetchData();
  }, []);
  const handleChange = (event: SelectChangeEvent) => {
    // setSubmitLangState(submitLangList[Number(event.target.value as string)]);
    setSubmitLangState(event.target.value as string);
    ipcRendererManager.send(
      "SET_NOWCONT_SUBMIT_LANGUAGE",
      submitLangList[Number(event.target.value as string)]
    );
  };

  return {
    submitLangList,
    setSubmitLangList,
    submitLangState,
    setSubmitLangState,
    handleChange,
  };
}
