import * as BoardConstants from '../constants/board-data.constants';
import { BoardHexOrientation } from '../models/enums/board-data.enums';

export class AngleAndOrientationUtils {
	static calculateOrientationAngle(i: number, orientation: BoardHexOrientation): number {
		return (BoardConstants.PI2 / 6) * i + (orientation == BoardHexOrientation.Angular ? 0 : BoardConstants.PI2 / 12);
	}

	static calculateRoundedHexAngle(adjX: number, adjY: number, centerX: number, centerY: number): number {
		const hexAngle = Math.round(((Math.atan2(adjY - centerY, adjX - centerX) * 180) / Math.PI + 360) % 360);
		return (Math.round(hexAngle / 30) * 30) % 360;
	}

	static arePointsOnSameLine(point1: { x: number; y: number }, point2: { x: number; y: number }, givenAngle: number, float: number): boolean {
		const dx = point2.x - point1.x;
		const dy = point2.y - point1.y;
		const calculatedAngle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
		const angleDifference = Math.abs(calculatedAngle - givenAngle);
		return angleDifference < 5 + float || angleDifference > 355 - float;
	}
}
