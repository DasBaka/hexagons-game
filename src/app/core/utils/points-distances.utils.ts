import { IBoardHexData } from '../models/interfaces/board-hex-data.interface';

/** Utility class providing static methods for calculating distances between points and hexagons on a 2D plane. */
export class PointDistancesUtils {
  /** Calculates and returns the rounded Euclidean distance between two points in a 2D plane. */
  public static getDistanceBetweenPoints(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  }

  /** Calculates the maximum distance to a hexagon based on its center point, radius, padding, and a scaling factor. */
  public static getMaxDistanceToHexagon(
    hexagon: IBoardHexData,
    centerPoint: { r: number; padding: number },
    factor: number
  ): number {
    return centerPoint.r * factor * centerPoint.padding * hexagon.padding;
  }

  /** Determines if a hexagon is within a specific range of distances from a center point, using lower and upper factor bounds. */
  public static isInBetweenHexagonDistances(
    hexagon: IBoardHexData,
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
