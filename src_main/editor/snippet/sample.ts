/*!
 *======================================================================
 *Project Name    : Hisui
 *File Name       : sample.ts
 *Copyright © 2020-2023 adenohitu. All rights reserved.
 *======================================================================
 */

import { IMarkdownString } from "monaco-editor";

export interface snippetObject {
  [key: string]: snippetInfomation;
}
export interface snippetInfomation {
  prefix: string;
  body: string[];
  description: string;
  documentation?: IMarkdownString;
}
// スニペットのサンプル
export const snippetPython = `{
  "map": {
    "prefix": "map",
    "body": ["= map(int, input().split())"],
    "description": "Atcoder_snippets"
  },
  "input_str": {
    "prefix": "ins",
    "body": ["= str(input())"],
    "description": "Atcoder_snippets"
  },
  "input_ini": {
    "prefix": "ini",
    "body": ["= int(input())"],
    "description": "Atcoder_snippets"
  },
  "input_list": {
    "prefix": "listmap",
    "body": ["= list(map(int, input().split()))"],
    "description": "Atcoder_snippets"
  },
  "input_nomal": {
    "prefix": "inp",
    "body": ["input()"],
    "description": "Atcoder_snippets"
  },
  "print": {
    "prefix": "pr",
    "body": ["print($0)"],
    "description": "Atcoder_snippets"
  },
  "for_range": {
    "prefix": "forr",
    "body": ["for $1 in range($2):", "\t$0"],
    "description": "Atcoder_snippets"
  }
}
`;
export const sampleCpp = `{
  "for": {
    "prefix": "f",
    "body": ["for (int i = $1; i < $2; i++){", "  $0", "}"],
    "description": "original"
  },

  "temp": {
    "prefix": "temp",
    "body": [
      "#include <bits/stdc++.h>",
      "using namespace std;",
      "",
      "int main() {",
      "  ",
      "}"
    ],
    "description": "original templete"
  },
  "cin": {
    "prefix": "cin",
    "body": ["cin >> $1;"],
    "description": "original"
  },
  "cout": {
    "prefix": "cout",
    "body": ["cout << $1 << endl;"],
    "description": "original"
  }
}
`;
