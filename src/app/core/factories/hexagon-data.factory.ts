import * as BoardConstants from '../constants/board-data.constants';
import { HexagonAdjectants } from '../models/classes/hexagon-adjectants.class';
import { BoardHexOrientation, BoardHexType } from '../models/enums/board-data.enums';
import { BoardHexDataInterface } from '../models/interfaces/board-hex-data.interface';
import { HexagonInstanceType } from '../models/interfaces/hexagon-instance-type.interface';

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
  public static createSingleHexagonData({
    x,
    y,
    baseRadius,
    ringLevel,
    id,
    isSubHex,
    hexType,
    orientation,
    padding
  }: HexagonDataFactoryProps): BoardHexDataInterface {
    let radius = baseRadius;
    let rotation = 0;
    let instanceType = { main: null, sub: null, border: false } as HexagonInstanceType;

    switch (hexType) {
      case BoardHexType.InnerHex:
        if (ringLevel === 0) {
          instanceType = { main: 'tar', sub: 'start', border: false };
        }
        if (!isSubHex && ringLevel === BoardConstants.INNER_RING_RADIUS - 1) {
          ringLevel += 1;
        }
        break;
      case BoardHexType.MiddleHex:
        rotation = 30;
        if (ringLevel === BoardConstants.MIDDLE_RING_RADIUS) {
          instanceType = isSubHex ? { main: null, sub: null, border: true } : { main: 'player', sub: 'tree', border: false };
        }
        ringLevel += 1;
        break;
      case BoardHexType.OuterHex:
        rotation = 30;
        if (!isSubHex && ringLevel === BoardConstants.MIDDLE_RING_RADIUS + 1) {
          radius *= BoardConstants.STARTER_HEX_SIZE;
          rotation = 0;
          instanceType = { main: 'player', sub: 'start', border: false };
          ringLevel += 2;
        }
        ringLevel += 1;
        break;
    }

    const adjectants = new HexagonAdjectants(x, y, ringLevel, id, orientation, radius, padding);

    return {
      x,
      y,
      radius,
      id,
      rotation,
      instanceType,
      ringLevel,
      adjectants,
      padding,
      sequence: [],
      adjectantsByName: [],
      bridgesByName: []
    };
  }
}
