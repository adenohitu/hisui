import { SelectChangeEvent } from "@mui/material";
import { editor } from "monaco-editor";
import { useEffect, useState } from "react";
import { languagetype } from "../../../src_main/file/extension";
import { ipcRendererManager } from "../../ipc";
import { snippetInfomation, snippetObject } from "../editor/monaco/sample";
export interface snippetInfomationinArrey extends snippetInfomation {
  title: string;
}
/**
 * LibManagimentを管理するHooks
 */
export const useLibManagement = () => {
  const [language, setLanguage] = useState<languagetype>("python");
  const [values, setValue] = useState<snippetInfomationinArrey[]>([]);

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
  /**
   * 言語の変更を取得
   */
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
  /**
   * 指定したIndexのデータを取得する
   */
  const getValueData = (indexNum: number) => {
    return { indexNum, data: values[indexNum] };
  };
  /**
   * 更新後のスニペットデータを保存する
   */
  const setNewData = async (
    indexNum: number,
    data: snippetInfomationinArrey
  ) => {
    const newArrey = values;
    newArrey[indexNum] = data;
    return setValue(newArrey);
  };
  /**
   * 新しいスニペットを作成する
   */
  const addNewValue = () => {
    const newArrey = values;
    const initData = {
      title: "",
      prefix: "",
      body: [],
      description: "",
    };
    const indexNum = newArrey.push(initData);
    setValue(newArrey);
    return { indexNum, data: initData };
  };
  /**
   * 指定したスニペットを削除する
   */
  const removeValue = (indexNum: number) => {
    const newArrey = values;
    newArrey.splice(indexNum, 1);
    return setValue(newArrey);
  };

  // UIState
  /**
   * Dialogの表示状態
   */
  const [openSettingDialogState, setopenSettingDialogState] =
    useState<boolean>(false);
  /**
   * DialogのFormData
   */
  const [indexNum, setIndexNum] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [body, setBody] = useState<string>("");
  /**
   * Formの更新イベント
   */
  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    switch (event.target.name) {
      case "title":
        setTitle(event.target.value);
        break;
      case "description":
        setDescription(event.target.value);
        break;
      case "prefix":
        setPrefix(event.target.value);
        break;
      default:
        console.log("key not found");
    }
  };
  /**
   * Editorの更新イベント
   */
  const handleEditorChange = (
    value: string | undefined,
    event: editor.IModelContentChangedEvent
  ) => {
    if (value) setBody(value);
  };
  /**
   * 登録されているデータを更新する
   */
  const openSettingDialog = (indexNum: number) => {
    // Dialogの中身を更新
    const data = getValueData(indexNum);
    setTitle(data.data.title);
    setDescription(data.data.description);
    setPrefix(data.data.prefix);
    setBody(data.data.body.join("\n"));
    setIndexNum(data.indexNum);
    // Dialogを開く
    setopenSettingDialogState(true);
  };
  /**
   * 新しくデータを作成する
   */
  const openNewDataSettingDialog = () => {
    const data = addNewValue();
    setTitle(data.data.title);
    setDescription(data.data.description);
    setPrefix(data.data.prefix);
    setBody(data.data.body.join("\n"));
    setIndexNum(data.indexNum);
    // Dialogを開く
    setopenSettingDialogState(true);
  };
  const removeSnippet = async () => {
    removeValue(indexNum);
    const valueObject: snippetObject = {};
    values.slice().forEach((arg) => {
      valueObject[arg.title] = {
        prefix: arg.prefix,
        body: arg.body,
        description: arg.description,
      };
    });

    await ipcRendererManager.invoke(
      "SET_LANG_SNIPPET",
      language,
      JSON.stringify(valueObject, null, "\t")
    );
    setopenSettingDialogState(false);
  };
  const updateSnippet = async () => {
    const bodyList = body.slice().split(/\n/);
    const setNewDataObject: snippetInfomationinArrey = {
      title: title,
      prefix: prefix,
      body: bodyList,
      description: description,
    };
    setNewData(indexNum, setNewDataObject);
    const valueObject: snippetObject = {};
    values.slice().forEach((arg) => {
      valueObject[arg.title] = {
        prefix: arg.prefix,
        body: arg.body,
        description: arg.description,
      };
    });

    await ipcRendererManager.invoke(
      "SET_LANG_SNIPPET",
      language,
      JSON.stringify(valueObject, null, "\t")
    );
    setopenSettingDialogState(false);
  };
  return {
    language,
    values,
    handleChangeLang,
    getValueData,
    setNewData,
    addNewValue,
    // UIState
    openSettingDialogState,
    setopenSettingDialogState,
    openSettingDialog,
    openNewDataSettingDialog,
    handleEditorChange,
    fieldHooks: {
      handleTextFieldChange,
      title,
      description,
      prefix,
      body,
    },
    updateSnippet,
    removeSnippet,
  };
};
