import { HexagonAdjectants } from '../classes/hexagon-adjectants.class';
import { IHexagonInstance } from './hexagon-instance-type.interface';

/** Defines the structure for hexagon data on the game board, including position, size, orientation, type, adjacency information, and related sequences. */
export interface IBoardHexData {
  x: number;
  y: number;
  radius: number;
  rotation: number;
  padding: number;
  instanceType: IHexagonInstance;
  ringLevel: number;
  id: number;
  adjectants: HexagonAdjectants;
  sequence: string[];
  adjectantsByName: string[];
  bridgesByName: string[];
}
