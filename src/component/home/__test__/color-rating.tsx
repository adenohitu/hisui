import { colorRating } from "../Home";

const testData = [
  [null, "gray"],
  [2800, "red"],
  [2400, "#FF8C00"],
  [2000, "#a0a"],
  [1600, "blue"],
  [1200, "#03A89E"],
  [800, "green"],
  [400, "#795548"],
  [0, "gray"],
];

test("Rating color test 1", async () => {
  testData.forEach((arg: any) => {
    expect(colorRating(arg[0])).toEqual(arg[1]);
  });
});
