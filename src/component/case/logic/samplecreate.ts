/*!
 *======================================================================
 *Project Name    : Hisui
 *File Name       : samplecreate.ts
 *Copyright © 2021 adenohitu. All rights reserved.
 *contributors    : @altair_kyopro
 *======================================================================
 */

import { max } from "lodash";
import { Layout } from "react-grid-layout";
import { elementStatus } from "../../../app/Slice/casecont";
import { evaluate } from "mathjs";
const seedrandom = require("seedrandom");

/**
 * ViewState、ElementStatusはStoreから入力
 * issue #38
 */
export async function RunCreateSample(
  viewState: Layout[],
  elementStatus: { [i: string]: elementStatus },
  seed: number
) {
  if (viewState.length !== 0) {
    //高さで並べたした後、横に並べる
    const sortData = await viewState
      .slice()
      .sort(function (a, b) {
        if (a.y > b.y) return -1;
        if (a.y < b.y) return 1;
        if (a.x > b.x) return -1;
        if (a.x < b.x) return 1;
        return 0;
      })
      .reverse();
    //横・縦の最大値を取得
    var maxWidthList = await sortData.slice().map((i) => i.x);
    const maxWidth = Number(max(maxWidthList)) + 1;
    var maxHeightList = await sortData.slice().map((i) => i.y);
    const maxHeight = Number(max(maxHeightList)) + 1;
    console.log(sortData);

    console.log("x" + maxWidth);
    console.log("y" + maxHeight);

    // 二次元配列を作成
    var resultList = new Array(maxWidth);
    for (let y = 0; y < maxHeight; y++) {
      resultList[y] = new Array(maxHeight).fill("");
    }
    console.log(elementStatus);

    for (let index = 0; index < sortData.length; index++) {
      const element = sortData[index];
      const elementstate: elementStatus = elementStatus[element.i];
      const minEval: number = evaluate(`${elementstate.min}`);
      const maxEvel: number = evaluate(`${elementstate.max}`);
      // 文字の深さを設定
      // 文字のUTF-16 コードユニットを取得
      const stringDeep = element.i.charCodeAt(0);
      // 位置深さを設定
      // 横のサイズの最大値＊高さ＋横
      const elementDeep = element.y * maxHeight + element.x;
      // 固有のSeedを生成
      const privateSeed = seed + elementDeep + stringDeep;
      // ランダムで値を生成
      const rng = seedrandom(privateSeed);
      const randomValue = Math.abs(rng.int32());
      // modで制約内に丸める
      const returnData = Math.floor(
        (randomValue % (maxEvel - minEval + 1)) + minEval
      );
      console.log(returnData);
      // 生成したものを配列に代入
      resultList[element.y][element.x] = returnData;
    }
    console.log(resultList);
    // 文字列を作成
    var str = "";
    for (let i = 0; i < maxHeight; i++) {
      const element = resultList[i].join(" ");
      str = str + element + "\n";
    }
    console.log(str);

    return str;
  }
}
