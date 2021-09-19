import { view } from "./view";
const url = {
  dev: "http://localhost:3000#/editor",
  product: `file://${__dirname}/../../index.html#/editor`,
};
class editorView extends view {}
export const editorViewapi = new editorView(url);
