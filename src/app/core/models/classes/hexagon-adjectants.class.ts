import { AngleAndOrientationUtils } from '../../utils/angle-and-orientation.utils';
import { EBoardHexOrientation } from '../enums/board-data.enums';
import { IAdjectant } from '../interfaces/board-hex-adjectants.interface';
import { IBoardHexData } from '../interfaces/board-hex-data.interface';
import { PointDistancesUtils } from '../../utils/points-distances.utils';
import { RingLevelSequencesFactory } from '../../factories/ringLevel-sequences.factory';
import { SpecialAdjectantsService } from '../../services/special-adjectants.service';

/** Represents a hexagon and manages its adjacency relationships with other hexagons in a hexagonal grid structure, including regular adjacents and special cases. */
export class HexagonAdjectants {
  readonly _hexData: { x: number; y: number; r: number; padding: number } = { x: 0, y: 0, r: 0, padding: 1 };
  _adjectants: IAdjectant = {};
  _currentRing: IBoardHexData[] = [];
  _unifiedAdjectantRings: IBoardHexData[] = [];

  constructor(
    x: number,
    y: number,
    readonly _ringLevel: number,
    readonly _id: number,
    orientation: EBoardHexOrientation,
    r: number,
    padding: number
  ) {
    this._hexData = { x, y, r, padding };
    this.initializeAdjectants(orientation);
  }

  /** Initializes the adjacent hexagons for the current hexagon based on the given orientation, calculating their positions and angles. */
  private initializeAdjectants(orientation: EBoardHexOrientation) {
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

  /** Calculates the coordinates of the adjacent hexagon based on the given angle and the current hexagon's position. */
  private calculateAdjectantCoordinates(angle: number): { adjX: number; adjY: number } {
    const { x, y, r, padding } = this._hexData;
    return {
      adjX: Math.round(x + r * 2 * Math.cos(angle) * padding),
      adjY: Math.round(y + r * 2 * Math.sin(angle) * padding)
    };
  }

  /** Validates the given hexagon angle to ensure it is a multiple of 30 degrees. */
  private validateHexagonAngle(angle: number): void {
    if (angle % 30 !== 0) {
      throw new Error('Invalid hexagon angle: ' + angle + ' is not a multiple of 30 degrees');
    }
  }

  /** Populates the current ring and unified adjacent rings arrays with hexagons from the surrounding rings in the hexagonal grid structure. */
  private getRingArrays(hexagonArray: IBoardHexData[][]): void {
    const prePreviousRing = hexagonArray[this._ringLevel - 2] ?? [];
    const previousRing = hexagonArray[this._ringLevel - 1] ?? [];
    this._currentRing = hexagonArray[this._ringLevel];
    const nextRing = hexagonArray[this._ringLevel + 1] ?? [];
    const nextNextRing = hexagonArray[this._ringLevel + 2] ?? [];
    this._unifiedAdjectantRings = [...prePreviousRing, ...previousRing, ...this._currentRing, ...nextRing, ...nextNextRing];
  }

  /** Adds a new adjacent or bridge hexagon to the specified angle's array of connections based on the given type, angle, and hexagon data. */
  public pushAdjectant(type: 'adjectant' | 'bridge', currentAngle: number, hexagon: IBoardHexData) {
    const targetArray =
      type === 'adjectant' ? this._adjectants[currentAngle].adjectantTo : this._adjectants[currentAngle].bridgeTo;
    targetArray.push({ ringLevel: hexagon.ringLevel, id: hexagon.id });
  }

  /** Searches for a hexagon in the given ring level array that aligns with the current angle and falls within the specified distance range, optionally allowing for a slight angular deviation. */
  public findCurrentPossibleHexagon(
    ringLevelArray: IBoardHexData[],
    currentAngle: number,
    distance: [number, number],
    float: number = 0
  ): IBoardHexData | undefined {
    return ringLevelArray.find(
      (hex) =>
        AngleAndOrientationUtils.arePointsOnSameLine(this._hexData, hex, currentAngle, float) &&
        this._id !== hex.id &&
        PointDistancesUtils.isInBetweenHexagonDistances(hex, this._hexData, ...distance)
    );
  }

  /** Identifies and populates the corresponding adjacent hexagons for the current hexagon by analyzing the provided hexagon array, including regular and special adjacency cases, and generates hexagon sequences. */
  public findCorrespondingAdjectants(hexagonArray: IBoardHexData[][]) {
    this.getRingArrays(hexagonArray);
    this.findRegularAdjectants(hexagonArray);
    this.findSpecialAdjectants(hexagonArray);
    RingLevelSequencesFactory.getHexSequences(this);
  }

  /** Identifies and assigns regular adjacent hexagons for the current hexagon by iterating through all angles and searching for matching hexagons in the unified adjacent rings array. */
  private findRegularAdjectants(hexagonArray: IBoardHexData[][]) {
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

  /** Identifies and assigns special adjacent hexagons for the current hexagon by iterating through all angles and applying special adjacency rules and generating bridge hexagon sequences. */
  private findSpecialAdjectants(hexagonArray: IBoardHexData[][]) {
    Object.keys(this._adjectants).forEach((angleKey) => {
      const currentAngle = parseInt(angleKey);
      SpecialAdjectantsService.findAdjectantsForSpecialCases(this, hexagonArray, currentAngle);
    });
  }

  /** Identifies and assigns bridge hexagons for the current hexagon by iterating through all angles and searching for matching hexagons in the next or nearby rings with a maximum of 2r distance to connect to the current hexagon. */
  private findBridges(hexagonArray: IBoardHexData[][], currentAngle: number) {
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
