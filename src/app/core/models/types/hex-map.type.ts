import { BoardHexDataInterface } from '../interfaces/board-hex-data.interface';

export type HexKey = '1' | '2' | '3' | '4' | '5' | '6';

export type HexMap = {
  [K in HexKey]: BoardHexDataInterface;
};
