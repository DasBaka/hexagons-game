import * as BoardConstants from '../constants/board-data.constants';
import { BoardHexType, HexColor } from '../models/enums/board-data.enums';
import { BoardHexDataInterface } from '../models/interfaces/board-hex-data.interface';

export class HexagonDataFactory {
	static createSingleHexagonData(x: number, y: number, baseRadius: number, ringIndex: number, isSubHex: boolean, hexType: BoardHexType): BoardHexDataInterface {
		let radius = baseRadius;
		let rotation = 0;
		let color = HexColor.Basic;

		switch (hexType) {
			case BoardHexType.InnerHex:
				if (ringIndex === 0) {
					color = HexColor.Center;
				}
				break;
			case BoardHexType.MiddleHex:
				rotation = 30;
				if (ringIndex === BoardConstants.MIDDLE_RING_RADIUS) {
					color = isSubHex ? HexColor.Border : HexColor.Tree;
				}
				break;
			case BoardHexType.OuterHex:
				rotation = 30;
				if (!isSubHex && ringIndex === BoardConstants.MIDDLE_RING_RADIUS + 1) {
					radius *= BoardConstants.STARTER_HEX_SIZE;
					rotation = 0;
					color = HexColor.Starter;
				}
				break;
		}

		return { x, y, radius, rotation, color };
	}
}
