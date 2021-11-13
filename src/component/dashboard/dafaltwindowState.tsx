import { MosaicNode } from "react-mosaic-component";

export const dashboadWindowState: MosaicNode<string> = {
  first: {
    direction: "column",
    first: {
      direction: "row",
      first: "time",
      second: "rank",
    },
    second: "score",
    splitPercentage: 24,
  },
  second: "totaltable",
  direction: "column",
  splitPercentage: 80,
};
