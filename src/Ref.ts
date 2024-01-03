export interface Ref {
  num: number;
  generation: number;
}

export class Ref {
  num: number;
  gen: number;
  refKeyword = "R";

  constructor(num: number, gen: number) {
    this.num = num;
    this.gen = gen;
  }
}