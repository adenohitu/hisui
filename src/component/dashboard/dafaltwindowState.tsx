import { MosaicNode } from "react-mosaic-component";

export const dashboadWindowState: MosaicNode<string> = {
  direction: "row",
  first: {
    direction: "column",
    first: { direction: "row", first: "time", second: "rank" },
    second: "submission",
    splitPercentage: 23,
  },
  second: {
    direction: "column",
    first: "score",
    second: "totaltable",
    splitPercentage: 75,
  },
};

// export const dashboadWindowState: MosaicNode<string> | null = {
//   first: {
//     first: {
//       direction: "row",
//       first: "time",
//       second: "rank",
//     },
//     second: "score",
//     direction: "column",
//     splitPercentage: 22,
//   },
//   second: "submission",
//   direction: "row",
// };

export const editorWindowState: MosaicNode<string> | null = {
  direction: "row",
  first: {
    direction: "row",
    first: "time",
    second: "editor",
    splitPercentage: 23,
  },
  second: {
    direction: "column",
    first: "score",
    second: "rank",
  },
  splitPercentage: 76,
};
