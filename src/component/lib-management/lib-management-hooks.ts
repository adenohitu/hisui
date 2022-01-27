import { SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { languagetype } from "../../../src_main/file/extension";
import { ipcRendererManager } from "../../ipc";
import { snippetInfomation, snippetObject } from "../editor/monaco/sample";
export interface snippetInfomationinArrey extends snippetInfomation {
  title: string;
}
export const useLibManagement = () => {
  const [language, setLanguage] = useState<languagetype>("python");
  const [value, setValue] = useState<snippetInfomationinArrey[]>([]);

  useEffect(() => {
    (async () => {
      const defaultLang: string | undefined = await ipcRendererManager.invoke(
        "GET_STORE",
        "defaultLanguage"
      );
      const Data: snippetObject = JSON.parse(
        await ipcRendererManager.invoke(
          "GET_LANG_SNIPPET",
          (defaultLang !== undefined && defaultLang) || "cpp"
        )
      );
      const convertArrey: snippetInfomationinArrey[] = Object.keys(Data).map(
        (title) => {
          return { title, ...Data[title] };
        }
      );
      console.log(convertArrey);

      setValue(convertArrey);
    })();
  }, []);

  const handleChangeLang = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as languagetype);
    (async () => {
      const Data: snippetObject = JSON.parse(
        await ipcRendererManager.invoke("GET_LANG_SNIPPET", event.target.value)
      );
      const convertArrey: snippetInfomationinArrey[] = Object.keys(Data).map(
        (title) => {
          return { title, ...Data[title] };
        }
      );
      setValue(convertArrey);
    })();
  };
  return { language, value, handleChangeLang };
};
