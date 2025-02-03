import { HexagonAdjectants } from '../classes/hexagon-adjectants.class';
import { HexColor } from '../enums/board-data.enums';

export interface BoardHexDataInterface {
	x: number;
	y: number;
	radius: number;
	rotation: number;
	padding: number;
	color: HexColor;
	ringLevel: number;
	id: number;
	adjectants: HexagonAdjectants;
	sequence: Array<String>;
	adjectantsByName: Array<String>;
	bridgesByName: Array<String>;
}
