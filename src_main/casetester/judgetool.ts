/**
 * コードを実行して出てきた出力と答えが一致しているかをチェックする
 */
export function ansCheck(answer: string, output: string) {
  if (answer === output) {
    return "AC";
  } else {
    return "WA";
  }
}
