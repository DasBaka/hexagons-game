import { BoardHexDataInterface } from '../models/interfaces/board-hex-data.interface';

export class PointDistancesUtils {
  public static getDistanceBetweenPoints(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  }

  public static getMaxDistanceToHexagon(
    hexagon: BoardHexDataInterface,
    centerPoint: { r: number; padding: number },
    factor: number
  ): number {
    return centerPoint.r * factor * centerPoint.padding * hexagon.padding;
  }

  public static isInBetweenHexagonDistances(
    hexagon: BoardHexDataInterface,
    centerPoint: { x: number; y: number; r: number; padding: number },
    lowerFactor: number,
    upperFactor: number
  ): boolean {
    return (
      this.getDistanceBetweenPoints(centerPoint, hexagon) <=
        this.getMaxDistanceToHexagon(hexagon, centerPoint, upperFactor) &&
      this.getDistanceBetweenPoints(centerPoint, hexagon) > this.getMaxDistanceToHexagon(hexagon, centerPoint, lowerFactor)
    );
  }
}
