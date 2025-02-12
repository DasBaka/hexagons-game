import * as BoardConstants from '../constants/board-data.constants';

import { EBoardHexOrientation, EBoardHexType } from '../models/enums/board-data.enums';

import { HexagonAdjectants } from '../models/classes/hexagon-adjectants.class';
import { IBoardHexData } from '../models/interfaces/board-hex-data.interface';
import { IHexagonInstance } from '../models/interfaces/hexagon-instance-type.interface';

/** Defines the properties required to create a hexagon data object using the HexagonDataFactory.*/
export interface IHexagonDataFactoryProps {
  x: number;
  y: number;
  baseRadius: number;
  ringLevel: number;
  id: number;
  isSubHex: boolean;
  hexType: EBoardHexType;
  orientation: EBoardHexOrientation;
  padding: number;
}

/** Factory class responsible for creating and configuring hexagon data objects with specific properties and behaviors based on the provided parameters. */
export class HexagonDataFactory {
  /** Creates and returns a single hexagon data object with calculated properties based on the input parameters, determining its position, size, type, and behavior within the game board. */
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
  }: IHexagonDataFactoryProps): IBoardHexData {
    let radius = baseRadius;
    let rotation = 0;
    let instanceType = { main: null, sub: null, border: false } as IHexagonInstance;

    switch (hexType) {
      case EBoardHexType.InnerHex:
        if (ringLevel === 0) {
          instanceType = { main: 'tar', sub: 'start', border: false };
        }
        if (!isSubHex && ringLevel === BoardConstants.INNER_RING_RADIUS - 1) {
          ringLevel += 1;
        }
        break;
      case EBoardHexType.MiddleHex:
        rotation = 30;
        if (ringLevel === BoardConstants.MIDDLE_RING_RADIUS) {
          instanceType = isSubHex ? { main: null, sub: null, border: true } : { main: 'player', sub: 'tree', border: false };
        }
        ringLevel += 1;
        break;
      case EBoardHexType.OuterHex:
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
