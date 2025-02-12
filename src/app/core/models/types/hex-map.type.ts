import { IBoardHexData } from '../interfaces/board-hex-data.interface';

/** Defines the valid string literal types representing the six possible keys for hexagons in a hex map. */
export type THexKey = '1' | '2' | '3' | '4' | '5' | '6';

/** Represents a 2D array representing a hexagonal grid. Each cell in the array contains a BoardHexDataInterface object. */
export type THexMap = {
  [K in THexKey]: IBoardHexData;
};
