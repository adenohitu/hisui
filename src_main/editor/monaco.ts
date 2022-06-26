import { app } from "electron";
import { readFile, mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { languages, languagetype } from "../file/extension";
import { ipcMainManager } from "../ipc/ipc";
import { parse } from "jsonc-parser";
import { setupLSP_Pyright } from "./lsp/pyright";
import { logger } from "../tool/logger/logger";
import { sampleCpp, snippetPython } from "./snippet/sample";
const snippetDataInit = `{
  "map": {
    "prefix": "map",
    "body": ["= map(int, input().split())"],
    "description": "Atcoder_snippets"
  }
}
`;
class monacoSetting {
  savefilepath: string;
  isMonacoReady: boolean;
  constructor() {
    this.isMonacoReady = false;
    this.savefilepath = this.getSettingfilepath();
  }
  /**
   * Snippetを保存するファイルのセットアップ
   */
  async setupSaveFolder() {
    return await mkdir(this.getSettingfilepath(), { recursive: true })
      .then((e) => {
        logger.info("createMonacoSettingDir", "monacoSettingApi");
      })
      .catch((e) => {
        logger.error(e, "monacoSettingApi");
      });
  }

  /**
   * 保存されているスニペットのデータを取得する
   */
  public async getSnippetFileData(lang: languagetype) {
    const data = await readFile(
      join(this.savefilepath, lang + ".snippet"),
      "utf-8"
    ).catch((e) => {
      const defaultsnippet: string =
        (lang === "cpp" && sampleCpp) ||
        (lang === "python" && snippetPython) ||
        snippetDataInit;
      // もしファイルが存在しない場合初期値をセット
      this.updateSnippet(lang, defaultsnippet);
      logger.error(e, "monacoSettingApi");
      return defaultsnippet;
    });
    return data;
  }
  /**
   * スニペットを更新する
   */
  public async updateSnippet(lang: languagetype, snippetIn: string) {
    try {
      writeFile(
        join(this.savefilepath, lang + ".snippet"),
        snippetIn,
        "utf-8"
      ).then((arg) => {
        this.loadSnippet(lang);
      });
      return "Success";
    } catch (e) {
      // Error handling
      logger.error(e, "monacoSettingApi");
      return "Error";
    }
  }
  /**
   * 全ての言語のスニペットを読み込む
   */
  public async loadSnippets() {
    (Object.keys(languages) as languagetype[]).forEach((lang) => {
      this.loadSnippet(lang);
    });
  }

  /**
   * 指定した言語のスニペットをEditorに読み込む
   */
  private async loadSnippet(lang: languagetype) {
    await readFile(join(this.savefilepath, lang + ".snippet"), "utf-8")
      .then((snippetin) => {
        // Json with Commentsをreplaceしparseしてから送る
        ipcMainManager.send(
          "LISTENER_CHANGE_EDITOR_SNIPPET",
          lang,
          parse(snippetin)
        );
      })
      .catch((e) => {
        logger.error(e, "monacoSettingApi");
      });
  }
  async setup() {
    ipcMainManager.on("MONACO_READY", () => {
      this.loadSnippets();
      this.isMonacoReady = true;
    });
    ipcMainManager.handle("GET_LANG_SNIPPET", async (e, lang: languagetype) => {
      const data = await this.getSnippetFileData(lang);
      return data;
    });
    ipcMainManager.handle(
      "SET_LANG_SNIPPET",
      async (e, lang: languagetype, snippetIn: string) => {
        const data = await this.updateSnippet(lang, snippetIn);
        return data;
      }
    );
    this.setupSaveFolder();
    setupLSP_Pyright();
    // setupLSP_Clangd();
  }
  getSettingfilepath() {
    return join(app.getPath("userData"), "setting", "snippet");
  }
}
export const monacoSettingApi = new monacoSetting();
