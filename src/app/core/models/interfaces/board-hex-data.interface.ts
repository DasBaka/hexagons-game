import { HexagonAdjectants } from '../classes/hexagon-adjectants.class';
import { HexagonInstanceType } from './hexagon-instance-type.interface';

export interface BoardHexDataInterface {
  x: number;
  y: number;
  radius: number;
  rotation: number;
  padding: number;
  instanceType: HexagonInstanceType;
  ringLevel: number;
  id: number;
  adjectants: HexagonAdjectants;
  sequence: string[];
  adjectantsByName: string[];
  bridgesByName: string[];
}
