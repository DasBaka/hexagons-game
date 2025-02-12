import { HexConnection } from '../types/hex-connection.type';

/** Represents the adjacent hexagons to a central hexagon on a hexagonal grid.*/
export interface IAdjectant {
  [angle: number]: IDirectionalHexData;
}

/** Represents directional data for a hexagon in relation to its neighbors on a hexagonal grid.*/
export interface IDirectionalHexData {
  direction: {
    x: number;
    y: number;
  };
  adjectantTo: HexConnection[];
  bridgeTo: HexConnection[];
}
