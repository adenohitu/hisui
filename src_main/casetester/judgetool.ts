/**
 * コードを実行して出てきた出力と答えが一致しているかをチェックする
 */
export function ansCheck(answer: string, output: string) {
  const checkans = answer.trim();
  const checkout = output.trim();
  if (checkans === checkout) {
    return "AC";
  } else {
    return "WA";
  }
}
