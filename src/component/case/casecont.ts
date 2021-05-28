export interface layoutstate {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
}
export class caseControl {
  layoutstate: layoutstate[];
  constructor() {
    this.layoutstate = [];
  }
  addLayout() {
    this.layoutstate.push({ i: "a", x: 0, y: 0, w: 1, h: 1 });
  }
}
export const caseContApi = new caseControl();
