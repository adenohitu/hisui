import { RunCreateSample } from "./samplecreate";
const ans = `8  
0  
0  
`;
const viewState = [
  {
    w: 1,
    h: 1,
    x: 0,
    y: 0,
    i: "N",
    moved: false,
    static: false,
    isResizable: false,
  },
  {
    w: 1,
    h: 1,
    x: 0,
    y: 1,
    i: "V",
    moved: false,
    static: false,
    isResizable: false,
  },
  {
    w: 1,
    h: 1,
    x: 0,
    y: 2,
    i: "S",
    moved: false,
    static: false,
    isResizable: false,
  },
];
const elementStatus = {
  N: {
    min: "0",
    leftsign: "<=",
    rightsign: "<=",
    max: "10",
  },
  S: {
    min: "0",
    leftsign: "<=",
    rightsign: "<=",
    max: "10",
  },
  V: {
    min: "0",
    leftsign: "<=",
    rightsign: "<=",
    max: "10",
  },
};
const seed = 1;
test("testCreateSample1", async () => {
  const returnData = await RunCreateSample(viewState, elementStatus, seed);
  expect(returnData).toBe(ans);
});
