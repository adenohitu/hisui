import { view } from "./view";

const url = {
  dev: "http://localhost:3000#/case",
  product: `file://${__dirname}/../../index.html#/case`,
};
class createsampleView extends view {}

export const createsampleViewapi = new createsampleView("case", url);
