import { view } from "./view";
const url = {
  dev: "http://localhost:3000#/dashboard",
  product: `file://${__dirname}/../../index.html#/dashboard`,
};
class dashboard extends view {}

export const dashboardapi = new dashboard("dashboard", url);
