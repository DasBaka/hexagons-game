export interface Adjectant {
  [angle: number]: DirectionalHexData;
}

export interface DirectionalHexData {
  direction: {
    x: number;
    y: number;
  };
  adjectantTo: HexConnection[];
  bridgeTo: HexConnection[];
}

export interface HexConnection {
  ringLevel: number;
  id: number;
}
