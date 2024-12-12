import { HexColor } from '../enums/board-data.enums';

export interface BoardHexDataInterface {
	x: number;
	y: number;
	radius: number;
	rotation: number;
	color: HexColor;
}
