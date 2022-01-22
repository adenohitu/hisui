/*!
 *======================================================================
 *Project Name    : Hisui
 *File Name       : sample.ts
 *Copyright © 2021-2022 adenohitu. All rights reserved.
 *contributors    : @altair_kyopro
 *======================================================================
 */
export interface snippetObject {
  [key: string]: {
    prefix: string;
    body: string[];
    description: string;
  };
}
// cppスニペットのサンプル
export const snippet: snippetObject = {
  for: {
    prefix: "f",
    body: ["for (int i = $1; i < $2; i++){", "\t$0", "}"],
    description: "original",
  },
  forll: {
    prefix: "fll",
    body: ["for (ll i = $1; i < $2; i++){", "\t$0", "}"],
    description: "original",
  },
  forback: {
    prefix: "fb",
    body: ["for (int i = $1; i >= $2; i--){", "\t$0", "}"],
    description: "original",
  },
  forbackll: {
    prefix: "fbll",
    body: ["for (ll i = $1; i >= $2; i--){", "\t$0", "}"],
    description: "original",
  },
  sort: {
    prefix: "s",
    body: ["sort($1.begin(), $1.end());"],
    description: "original",
  },
  cin: {
    prefix: "cin",
    body: ["cin >> $1;"],
    description: "original",
  },
  cout: {
    prefix: "cout",
    body: ["cout << $1 << endl;"],
    description: "original",
  },
};
