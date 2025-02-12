import { BoardHexOrientation, BoardHexType } from '../models/enums/board-data.enums';

/** Represents the value of 2π (two times pi), commonly used in circular and trigonometric calculations for a full rotation. */
export const PI2 = Math.PI * 2;

/** Defines the radius/maximum range of the inner ring of hexagons on the game board, set to 5 units. */
export const INNER_RING_RADIUS = 5;

/** Defines the radius/maximum range of the middle ring of hexagons on the game board, set to 7 units. */
export const MIDDLE_RING_RADIUS = 7;

/** Defines the size multiplier for starter hexagons, set to 1.5 times the standard hexagon size. */
export const STARTER_HEX_SIZE = 1.5;

/** Represents the initial padding ratio for hexagons, set to 1. */
export const DEFAULT_PADDING_RATIO = 1;

/** Represents the initial padding ratio for middle hexagons, set to 1.125 times the standard hexagon size. */
export const MIDDLE_HEX_PADDING_RATIO_INITIAL = 1.125 * DEFAULT_PADDING_RATIO;

/** Represents the padding ratio for middle hexagons during a blocker level, set to 1.09 times the standard hexagon size. */
export const MIDDLE_HEX_PADDING_RATIO_BLOCKER = 1.09 * DEFAULT_PADDING_RATIO;

/** Represents the reset padding ratio for middle hexagons, set to 1.1 times the standard hexagon size. */
export const MIDDLE_PADDING_RATIO_RESET = 1.1 * DEFAULT_PADDING_RATIO;

/** Represents the padding ratio for outer hexagons, set to 1.09 times the standard hexagon size. */
export const OUTER_HEX_PADDING_RATIO = 1.09 * DEFAULT_PADDING_RATIO;

/** Represents the padding ratio for outer hexagons during a blocker level, set to 1.11 times the standard hexagon size. */
export const OUTER_HEX_PADDING_RATIO_FOR_STARTERS = 1.11 * DEFAULT_PADDING_RATIO;

/** Defines the configuration object for different types of hexagon rings, including their properties such as ring level, hex type, and orientation. */
export const HEX_RING_CONFIGS = {
  INNER: {
    INITIAL: {
      ringLevel: 0,
      isSubHex: false,
      hexType: BoardHexType.InnerHex,
      orientation: BoardHexOrientation.Angular
    },
    MAIN: {
      isSubHex: false,
      hexType: BoardHexType.InnerHex,
      orientation: BoardHexOrientation.Angular
    },
    SUB: {
      isSubHex: true,
      hexType: BoardHexType.InnerHex,
      orientation: BoardHexOrientation.Angular
    }
  },
  MIDDLE: {
    MAIN: {
      isSubHex: false,
      hexType: BoardHexType.MiddleHex,
      orientation: BoardHexOrientation.Flat
    },
    SUB: {
      isSubHex: true,
      hexType: BoardHexType.MiddleHex,
      orientation: BoardHexOrientation.Flat
    }
  },
  OUTER: {
    MAIN: {
      isSubHex: false,
      hexType: BoardHexType.OuterHex,
      orientation: BoardHexOrientation.Angular
    },
    SUB: {
      isSubHex: true,
      hexType: BoardHexType.OuterHex,
      orientation: BoardHexOrientation.Flat
    }
  }
};
