import * as BoardConstants from '../constants/board-data.constants';
import { HexagonAdjectants } from '../models/classes/hexagon-adjectants.class';
import { BoardHexOrientation, BoardHexType, HexColor } from '../models/enums/board-data.enums';
import { BoardHexDataInterface } from '../models/interfaces/board-hex-data.interface';

export interface HexagonDataFactoryProps {
	x: number;
	y: number;
	baseRadius: number;
	ringLevel: number;
	id: number;
	isSubHex: boolean;
	hexType: BoardHexType;
	orientation: BoardHexOrientation;
	padding: number;
}

export class HexagonDataFactory {
	static createSingleHexagonData({ x, y, baseRadius, ringLevel, id, isSubHex, hexType, orientation, padding }: HexagonDataFactoryProps): BoardHexDataInterface {
		let radius = baseRadius;
		let rotation = 0;
		let color = HexColor.Basic;

		switch (hexType) {
			case BoardHexType.InnerHex:
				if (ringLevel === 0) {
					color = HexColor.Center;
				}
				if (!isSubHex && ringLevel === BoardConstants.INNER_RING_RADIUS - 1) {
					ringLevel += 1;
				}
				break;
			case BoardHexType.MiddleHex:
				rotation = 30;
				if (ringLevel === BoardConstants.MIDDLE_RING_RADIUS) {
					color = isSubHex ? HexColor.Border : HexColor.Tree;
				}
				ringLevel += 1;
				break;
			case BoardHexType.OuterHex:
				rotation = 30;
				if (!isSubHex && ringLevel === BoardConstants.MIDDLE_RING_RADIUS + 1) {
					radius *= BoardConstants.STARTER_HEX_SIZE;
					rotation = 0;
					color = HexColor.Starter;
					ringLevel += 2;
				}
				ringLevel += 1;
				break;
		}

		const adjectants = new HexagonAdjectants(x, y, ringLevel, id, orientation, radius, padding);

		return { x, y, radius, id, rotation, color, ringLevel, adjectants, padding, sequence: [], adjectantsByName: [], bridgesByName: [] };
	}
}
