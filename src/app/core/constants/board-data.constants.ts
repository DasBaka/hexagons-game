import { BoardHexOrientation, BoardHexType } from '../models/enums/board-data.enums';

export const PI2 = Math.PI * 2;
export const INNER_RING_RADIUS = 5;
export const MIDDLE_RING_RADIUS = 7;
export const STARTER_HEX_SIZE = 1.5;
export const DEFAULT_PADDING_RATIO = 1;
export const MIDDLE_HEX_PADDING_RATIO_INITIAL = 1.125 * DEFAULT_PADDING_RATIO;
export const MIDDLE_HEX_PADDING_RATIO_BLOCKER = 1.09 * DEFAULT_PADDING_RATIO;
export const MIDDLE_PADDING_RATIO_RESET = 1.1 * DEFAULT_PADDING_RATIO;
export const OUTER_HEX_PADDING_RATIO = 1.09 * DEFAULT_PADDING_RATIO;
export const OUTER_HEX_PADDING_RATIO_FOR_STARTERS = 1.11 * DEFAULT_PADDING_RATIO;

export const HEX_RING_CONFIGS = {
	INNER: {
		INITIAL: {
			ringLevel: 0,
			isSubHex: false,
			hexType: BoardHexType.InnerHex,
			orientation: BoardHexOrientation.Angular,
		},
		MAIN: {
			isSubHex: false,
			hexType: BoardHexType.InnerHex,
			orientation: BoardHexOrientation.Angular,
		},
		SUB: {
			isSubHex: true,
			hexType: BoardHexType.InnerHex,
			orientation: BoardHexOrientation.Angular,
		},
	},
	MIDDLE: {
		MAIN: {
			isSubHex: false,
			hexType: BoardHexType.MiddleHex,
			orientation: BoardHexOrientation.Flat,
		},
		SUB: {
			isSubHex: true,
			hexType: BoardHexType.MiddleHex,
			orientation: BoardHexOrientation.Flat,
		},
	},
	OUTER: {
		MAIN: {
			isSubHex: false,
			hexType: BoardHexType.OuterHex,
			orientation: BoardHexOrientation.Angular,
		},
		SUB: {
			isSubHex: true,
			hexType: BoardHexType.OuterHex,
			orientation: BoardHexOrientation.Flat,
		},
	},
};
