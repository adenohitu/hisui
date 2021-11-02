import { app } from "electron";
import { readFile, mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { languages, languagetype } from "../file/extension";
import { ipcMainManager } from "../ipc/ipc";
import { parse } from "jsonc-parser";
class monacoSetting {
  savefilepath: string;
  constructor() {
    this.savefilepath = this.getSettingfilepath();
  }
  /**
   * Snippetを保存するファイルのセットアップ
   */
  async setupSaveFolder() {
    return await mkdir(this.getSettingfilepath(), { recursive: true })
      .then((e) => {
        console.log("設定保存ファイルを作成");
      })
      .catch((e) => {
        console.log(e);
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
      console.log(`ReadError:${e}`);
      return "";
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
      console.log(e); // SyntaxError: Unexpected token o in JSON at position 1
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
        console.log(`ReadError:${e}`);
      });
  }
  async setup() {
    ipcMainManager.on("RUN_RELOAD_SNIPPET", () => {
      this.loadSnippets();
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
  }
  getSettingfilepath() {
    return join(app.getPath("userData"), "setting", "snippet");
  }
}
export const monacoSettingApi = new monacoSetting();
