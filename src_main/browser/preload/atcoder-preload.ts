import { contextBridge, ipcRenderer } from "electron";
import {
  atcoderCodeTestResult,
  codeTestInfo,
} from "../../data/code-test/codetest";
//分離されたプリロードスクリプト

/**
 * TaskViewwindowのLoadとMainのContext
 */
contextBridge.exposeInMainWorld("api", {
  opencontext: () => {
    ipcRenderer.send("OPEN_CONTEXT_MENU");
  },
});
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  ipcRenderer.send("OPEN_CONTEXT_MENU");
});
// サンプル実行ボタンをDOM実装
if (
  window.location.origin === "https://atcoder.jp" &&
  window.location.pathname.includes("tasks")
) {
  setTimeout(() => {
    window.document
      .querySelectorAll("#task-statement section")
      .forEach((e, i) => {
        e.querySelectorAll(`h3`).forEach((ele) => {
          if (ele.innerText?.includes("入力")) {
            if (ele.querySelector("span")) {
              // ButtonElementを作成
              const buttonObject = document.createElement("span");
              buttonObject.id = "app-copy-button";
              buttonObject.className =
                "ml-1 btn btn-default btn-sm btn-copy btn-success px-2";
              buttonObject.innerHTML = "コードテストで実行";
              buttonObject.onclick = function (clickEvent) {
                const numindex = String(ele.innerText).indexOf("例") + 1;
                const endindex = String(ele.innerText).indexOf("C");
                const sampleID = ele.innerText
                  ?.slice(numindex, endindex)
                  .trim();
                const sampleData = String(e.querySelector("pre")?.textContent);
                // テストを実行
                const infodata: codeTestInfo = {
                  input: sampleData,
                  answer: null,
                  caseName: sampleID,
                  testGroupID: `view-button:${window.location.pathname}`,
                };
                if (
                  buttonObject.className ===
                  "ml-1 btn btn-default btn-sm btn-copy btn-success px-2"
                ) {
                  ipcRenderer.send("RUN_CODETEST_NOWTOP", infodata);
                }
                // 結果を表示するElementを追加
                // 出力表示
                const resultStdout =
                  document.querySelector(`#result-stdout-case-${sampleID}`) ||
                  document.createElement("pre");
                resultStdout.id = `result-stdout-case-${sampleID}`;

                // TestInfo表示(結果表示)
                const resultTestInfo =
                  document.querySelector(`#result-info-case-${sampleID}`) ||
                  document.createElement("div");
                resultTestInfo.id = `result-info-case-${sampleID}`;
                resultTestInfo.className = "alert alert-info";
                resultTestInfo.textContent = "実行中";
                // Title表示
                const resultTitle =
                  document.querySelector(`#result-text-case-${sampleID}`) ||
                  document.createElement("h4");
                resultTitle.id = `result-text-case-${sampleID}`;
                resultTitle.textContent = "コードテスト結果";
                // 初回DOM書き込み
                if (
                  !document.querySelector(`#result-stdout-case-${sampleID}`)
                ) {
                  e.appendChild(resultTitle);
                  e.appendChild(resultTestInfo);
                  e.appendChild(resultStdout);
                }

                // 初期状態に更新
                resultStdout.textContent = "Now Running...";
                buttonObject.className =
                  "ml-1 btn btn-default btn-sm btn-copy btn-success px-2 disabled";

                ipcRenderer.on(
                  "LISTENER_CODETEST_STATUS_EVENT",
                  (e, info: atcoderCodeTestResult) => {
                    if (
                      info.testGroup ===
                      `view-button:${window.location.pathname}`
                    ) {
                      if (info.caseName === sampleID) {
                        resultStdout.textContent = String(info.Stdout);
                        resultTestInfo.className = "alert alert-success";
                        resultTestInfo.textContent = `終了コード: ${info.Result.ExitCode}, 実行時間:${info.Result.TimeConsumption}ms, メモリ: ${info.Result.MemoryConsumption}KB,`;
                        buttonObject.className =
                          "ml-1 btn btn-default btn-sm btn-copy btn-success px-2";
                      }
                    }
                  }
                );
              };
              // DOMに追加
              ele.appendChild(buttonObject);
            }
          }
        });
      });
  }, 1000);
}
