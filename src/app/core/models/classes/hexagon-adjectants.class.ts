import { RingLevelSequencesFactory } from '../../factories/ringLevel-sequences.factory';
import { SpecialAdjectantsService } from '../../services/special-adjectants.service';
import { AngleAndOrientationUtils } from '../../utils/angle-and-orientation.utils';
import { PointDistancesUtils } from '../../utils/points-distances.utils';
import { BoardHexOrientation } from '../enums/board-data.enums';
import { Adjectant } from '../interfaces/board-hex-adjectants.interface';
import { BoardHexDataInterface } from '../interfaces/board-hex-data.interface';

export class HexagonAdjectants {
  readonly _hexData: { x: number; y: number; r: number; padding: number } = { x: 0, y: 0, r: 0, padding: 1 };
  _adjectants: Adjectant = {};
  _currentRing: BoardHexDataInterface[] = [];
  _unifiedAdjectantRings: BoardHexDataInterface[] = [];

  constructor(
    x: number,
    y: number,
    readonly _ringLevel: number,
    readonly _id: number,
    orientation: BoardHexOrientation,
    r: number,
    padding: number
  ) {
    this._hexData = { x, y, r, padding };
    this.initializeAdjectants(orientation);
  }

  private initializeAdjectants(orientation: BoardHexOrientation) {
    for (let i = 0; i < 6; i++) {
      // IMPORTANT: The adjectants direction angle is calculated to the x-axis, not the center of the hexagon (because of atan2), and then determined in clockwise order from the x-axis.
      const angle = AngleAndOrientationUtils.calculateOrientationAngle(i, orientation);
      const { adjX, adjY } = this.calculateAdjectantCoordinates(angle);
      const roundedHexAngle = AngleAndOrientationUtils.calculateRoundedHexAngle(
        adjX,
        adjY,
        this._hexData.x,
        this._hexData.y
      );

      this._adjectants[roundedHexAngle] = {
        direction: {
          x: adjX,
          y: adjY
        },
        adjectantTo: [],
        bridgeTo: []
      };
      this.validateHexagonAngle(roundedHexAngle);
    }
  }

  private calculateAdjectantCoordinates(angle: number): { adjX: number; adjY: number } {
    const { x, y, r, padding } = this._hexData;
    return {
      adjX: Math.round(x + r * 2 * Math.cos(angle) * padding),
      adjY: Math.round(y + r * 2 * Math.sin(angle) * padding)
    };
  }

  private validateHexagonAngle(angle: number): void {
    if (angle % 30 !== 0) {
      throw new Error('Invalid hexagon angle: ' + angle + ' is not a multiple of 30 degrees');
    }
  }

  private getRingArrays(hexagonArray: BoardHexDataInterface[][]): void {
    const prePreviousRing = hexagonArray[this._ringLevel - 2] ?? [];
    const previousRing = hexagonArray[this._ringLevel - 1] ?? [];
    this._currentRing = hexagonArray[this._ringLevel];
    const nextRing = hexagonArray[this._ringLevel + 1] ?? [];
    const nextNextRing = hexagonArray[this._ringLevel + 2] ?? [];
    this._unifiedAdjectantRings = [...prePreviousRing, ...previousRing, ...this._currentRing, ...nextRing, ...nextNextRing];
  }

  public pushAdjectant(type: 'adjectant' | 'bridge', currentAngle: number, hexagon: BoardHexDataInterface) {
    const targetArray =
      type === 'adjectant' ? this._adjectants[currentAngle].adjectantTo : this._adjectants[currentAngle].bridgeTo;
    targetArray.push({ ringLevel: hexagon.ringLevel, id: hexagon.id });
  }

  public findCurrentPossibleHexagon(
    ringLevelArray: BoardHexDataInterface[],
    currentAngle: number,
    distance: [number, number],
    float: number = 0
  ): BoardHexDataInterface | undefined {
    return ringLevelArray.find(
      (hex) =>
        AngleAndOrientationUtils.arePointsOnSameLine(this._hexData, hex, currentAngle, float) &&
        this._id !== hex.id &&
        PointDistancesUtils.isInBetweenHexagonDistances(hex, this._hexData, ...distance)
    );
  }

  public findCorrespondingAdjectants(hexagonArray: BoardHexDataInterface[][]) {
    this.getRingArrays(hexagonArray);
    this.findRegularAdjectants(hexagonArray);
    this.findSpecialAdjectants(hexagonArray);
    RingLevelSequencesFactory.getHexSequences(this);
  }

  private findRegularAdjectants(hexagonArray: BoardHexDataInterface[][]) {
    Object.keys(this._adjectants).forEach((angleKey) => {
      const currentAngle = parseInt(angleKey);
      const foundAdjectant = this.findCurrentPossibleHexagon(
        this._unifiedAdjectantRings,
        currentAngle,
        [0, 2],
        this._ringLevel === 5 ? 10 : 0
      );

      if (foundAdjectant === undefined) {
        // if not found, check for a hexagon in the next or nearby rings with a maximum of 2r distance to connect to the current hexagon
        this.findBridges(hexagonArray, currentAngle);
      } else this.pushAdjectant('adjectant', currentAngle, foundAdjectant);
    });
  }

  private findSpecialAdjectants(hexagonArray: BoardHexDataInterface[][]) {
    Object.keys(this._adjectants).forEach((angleKey) => {
      const currentAngle = parseInt(angleKey);
      SpecialAdjectantsService.findAdjectantsForSpecialCases(this, hexagonArray, currentAngle);
    });
  }

  private findBridges(hexagonArray: BoardHexDataInterface[][], currentAngle: number) {
    const foundBridge = this.findCurrentPossibleHexagon(this._unifiedAdjectantRings, currentAngle, [2, 4]);

    if (!((this._ringLevel === 5 && this._id < 42) || this._ringLevel === 4)) {
      if (foundBridge === undefined || this._ringLevel === 11) {
        if (this._ringLevel == 9 || this._ringLevel == 10) {
          const startingBase = this.findCurrentPossibleHexagon(hexagonArray[11], currentAngle, [0, 4], 20);

          if (startingBase !== undefined) {
            this._adjectants[currentAngle].adjectantTo.push({ ringLevel: startingBase.ringLevel, id: startingBase.id });
          }
        }
      } else this.pushAdjectant('bridge', currentAngle, foundBridge);
    }
  }
}
