import { view } from "./view";

const test = {
  dev: "http://localhost:3000#/",
  product: `file://${__dirname}/../../index.html#/`,
};
class mainPage extends view {}

export const mainPageapi = new mainPage("main", test);
