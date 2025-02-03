import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { updateStore } from '../../store/store.feature';

import * as BoardConstants from '../constants/board-data.constants';
import { HexagonDataFactory, HexagonDataFactoryProps } from '../factories/hexagon-data.factory';
import { BoardHexOrientation } from '../models/enums/board-data.enums';
import { BoardHexDataInterface } from '../models/interfaces/board-hex-data.interface';

@Injectable({
	providedIn: 'root',
})
export class CanvasScreenService {
	paddingRatio: number = BoardConstants.DEFAULT_PADDING_RATIO;
	hexagonArray: Array<BoardHexDataInterface[]> = [];
	baseHexData: { x: number; y: number; r: number } = { x: 0, y: 0, r: 0 };
	currentHexPosition: { x: number; y: number } = { x: 0, y: 0 };
	id: number = 0;

	constructor(private store: Store) {}

	createHexesData(centerX: number, centerY: number, hexRadius: number) {
		if (centerX < 0 || centerY < 0 || hexRadius <= 0) {
			throw new Error('Invalid input parameters for createHexesData');
		}

		this.hexagonArray = [];
		this.id = 0;
		this.baseHexData = { x: centerX, y: centerY, r: hexRadius };

		this.createInnerHex();
		this.createMiddleHex();
		this.createOuterHex();

		this.hexagonArray.forEach((ringHexagons) => {
			ringHexagons.forEach((hexagon) => {
				hexagon.adjectants.findCorrespondingAdjectants(this.hexagonArray);
			});
		});

		this.store.dispatch(updateStore({ key: 'boardHexagons', value: this.hexagonArray }));
	}

	private calcCurrentPosition(sideIndex: number, ringLevel: number, orientation: BoardHexOrientation, subHex: Boolean): { x: number; y: number } {
		const angle = (sideIndex * BoardConstants.PI2) / 6 + (subHex === true ? BoardConstants.PI2 / 3 : 0);
		const distance = this.baseHexData.r * 2 * ringLevel * this.paddingRatio;
		const [sin, cos] = [Math.sin(angle) * distance, Math.cos(angle) * distance];
		const { x, y } = subHex === true ? this.currentHexPosition : this.baseHexData;
		const currentCoords: { x: number; y: number } = orientation === BoardHexOrientation.Angular ? { x: x + cos, y: y + sin } : { x: x + sin, y: y + cos };

		if (subHex === false) {
			this.currentHexPosition = { ...currentCoords };
		}

		return { ...currentCoords };
	}

	private addHexagonData(hexagonData: BoardHexDataInterface) {
		if (this.hexagonArray[hexagonData.ringLevel] === undefined) {
			this.hexagonArray[hexagonData.ringLevel] = [];
		}
		this.hexagonArray[hexagonData.ringLevel].push(hexagonData);
		this.id++;
	}

	private createSingleHexagonData(props: Omit<HexagonDataFactoryProps, 'baseRadius' | 'padding'>): BoardHexDataInterface {
		return HexagonDataFactory.createSingleHexagonData({
			...props,
			baseRadius: this.baseHexData.r,
			padding: this.paddingRatio,
		});
	}

	private createInnerHex() {
		const [x, y] = [this.baseHexData.x, this.baseHexData.y];
		const id = this.id;
		const innerInitialProps = BoardConstants.HEX_RING_CONFIGS.INNER.INITIAL;

		this.addHexagonData(this.createSingleHexagonData({ x, y, id, ...innerInitialProps }));
		const innerHexEnd = BoardConstants.INNER_RING_RADIUS;

		for (let ringLevel = 1; ringLevel <= innerHexEnd; ringLevel++) {
			this.createInnerMainHexes(ringLevel, innerHexEnd);
		}
	}

	private createInnerMainHexes(ringLevel: number, innerHexEnd: number) {
		const limitInnerHex = ringLevel < innerHexEnd;
		const blocker = ringLevel !== 2;
		const innerMainProps = BoardConstants.HEX_RING_CONFIGS.INNER.MAIN;

		for (let sideIndex = 0; sideIndex < 6; sideIndex++) {
			const { x, y } = this.calcCurrentPosition(sideIndex, ringLevel, innerMainProps.orientation, innerMainProps.isSubHex);
			const id = this.id;

			if (limitInnerHex && blocker) {
				this.addHexagonData(this.createSingleHexagonData({ x, y, ringLevel, id, ...innerMainProps }));
			}

			this.createInnerSubHexes(ringLevel, sideIndex, innerHexEnd);
		}
	}

	private createInnerSubHexes(ringLevel: number, sideIndex: number, innerHexEnd: number) {
		const innerSubProps = BoardConstants.HEX_RING_CONFIGS.INNER.SUB;
		for (let subHexIndex = 1; subHexIndex < ringLevel; subHexIndex++) {
			const { x, y } = this.calcCurrentPosition(sideIndex, subHexIndex, innerSubProps.orientation, innerSubProps.isSubHex);
			const limitInnerSubHexes = ringLevel < innerHexEnd - 1 || (ringLevel == innerHexEnd - 1 && subHexIndex == ringLevel / 2);
			const id = this.id;

			if (limitInnerSubHexes) {
				this.addHexagonData(this.createSingleHexagonData({ x, y, ringLevel, id, ...innerSubProps }));
			}
		}
	}

	private createMiddleHex() {
		this.paddingRatio = BoardConstants.MIDDLE_HEX_PADDING_RATIO_INITIAL;

		const middleHexStart = BoardConstants.INNER_RING_RADIUS - 1;
		const middleHexEnd = BoardConstants.MIDDLE_RING_RADIUS;

		for (let ringLevel = middleHexStart; ringLevel <= middleHexEnd; ringLevel++) {
			this.createMiddleMainHexes(ringLevel, middleHexStart, middleHexEnd);
		}
	}

	private createMiddleMainHexes(ringLevel: number, middleHexStart: number, middleHexEnd: number) {
		const isBlockerLevelCase = ringLevel != BoardConstants.INNER_RING_RADIUS;
		const middleMainProps = BoardConstants.HEX_RING_CONFIGS.MIDDLE.MAIN;

		for (let sideIndex = 0; sideIndex < 6; sideIndex++) {
			if (ringLevel == middleHexEnd) this.paddingRatio = BoardConstants.MIDDLE_HEX_PADDING_RATIO_BLOCKER;
			const { x, y } = this.calcCurrentPosition(sideIndex, ringLevel, middleMainProps.orientation, middleMainProps.isSubHex);
			const id = this.id;

			if (isBlockerLevelCase) {
				this.addHexagonData(this.createSingleHexagonData({ x, y, ringLevel, id, ...middleMainProps }));
			}

			this.createMiddleSubHexes(ringLevel, sideIndex, middleHexStart, isBlockerLevelCase);
		}
		if (ringLevel > middleHexStart) this.paddingRatio = BoardConstants.MIDDLE_PADDING_RATIO_RESET;
	}

	private createMiddleSubHexes(ringLevel: number, sideIndex: number, middleHexStart: number, isBlockerLevelCase: boolean) {
		const middleSubProps = BoardConstants.HEX_RING_CONFIGS.MIDDLE.SUB;
		for (let subHexIndex = 1; subHexIndex < ringLevel; subHexIndex++) {
			const { x, y } = this.calcCurrentPosition(sideIndex, subHexIndex, middleSubProps.orientation, middleSubProps.isSubHex);
			const id = this.id;

			const isPreMiddleRingSpecialCase = ringLevel > middleHexStart || (ringLevel == middleHexStart && (subHexIndex == 1 || subHexIndex == ringLevel - 1));
			const skipSubHexesAroundBlockersIfFalse =
				(isBlockerLevelCase == false && subHexIndex !== 1 && subHexIndex !== ringLevel - 1) || isBlockerLevelCase === true;

			if (isPreMiddleRingSpecialCase && skipSubHexesAroundBlockersIfFalse) {
				this.addHexagonData(this.createSingleHexagonData({ x, y, ringLevel, id, ...middleSubProps }));
			}
		}
	}

	private createOuterHex() {
		const outerHexStart = BoardConstants.MIDDLE_RING_RADIUS + 1;
		const outerHexEnd = BoardConstants.MIDDLE_RING_RADIUS + 2;

		for (let ringLevel = outerHexStart; ringLevel <= outerHexEnd; ringLevel++) {
			this.createOuterMainHexes(ringLevel, outerHexStart, outerHexEnd);
		}
	}

	private createOuterMainHexes(ringLevel: number, outerHexStart: number, outerHexEnd: number) {
		this.paddingRatio = BoardConstants.OUTER_HEX_PADDING_RATIO;
		const outerSubProps = BoardConstants.HEX_RING_CONFIGS.OUTER.SUB;

		if (ringLevel >= outerHexStart) {
			for (let sideIndex = 0; sideIndex < 6; sideIndex++) {
				this.calcCurrentPosition(sideIndex, ringLevel, outerSubProps.orientation, false);

				for (let subHexIndex = 1; subHexIndex < ringLevel; subHexIndex++) {
					if (ringLevel == outerHexStart || (ringLevel == outerHexEnd && subHexIndex % 3 == 0)) {
						const { x, y } = this.calcCurrentPosition(sideIndex, subHexIndex, outerSubProps.orientation, outerSubProps.isSubHex);
						const id = this.id;

						this.addHexagonData(this.createSingleHexagonData({ x, y, ringLevel, id, ...outerSubProps }));
					}
				}
			}
		}

		if (ringLevel == outerHexStart) {
			this.createStarters(ringLevel);
		}
	}

	private createStarters(ringLevel: number) {
		this.paddingRatio = BoardConstants.OUTER_HEX_PADDING_RATIO_FOR_STARTERS;
		const outerMainProps = BoardConstants.HEX_RING_CONFIGS.OUTER.MAIN;

		for (let sideIndex = 0; sideIndex < 6; sideIndex++) {
			const { x, y } = this.calcCurrentPosition(sideIndex, ringLevel, outerMainProps.orientation, outerMainProps.isSubHex);
			const id = this.id;

			this.addHexagonData(this.createSingleHexagonData({ x, y, ringLevel, id, ...outerMainProps }));
		}
	}
}
