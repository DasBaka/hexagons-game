export class GamingEntity {
  possibleDirections: any;
  dices: {
    normal: number;
    corrupted: number;
    leading: number;
  };

  constructor(initialDices: { normal: number; corrupted: number; leading: number }) {
    this.dices = { ...initialDices };
  }
}
