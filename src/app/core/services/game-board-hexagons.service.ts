import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { updateStore } from '../../store/store.feature';

import * as BoardConstants from '../constants/board-data.constants';
import { HexagonDataFactory } from '../factories/hexagon-data.factory';
import { BoardHexOrientation, BoardHexType, HexColor } from '../models/enums/board-data.enums';
import { BoardHexDataInterface } from '../models/interfaces/board-hex-data.interface';

@Injectable({
	providedIn: 'root',
})
export class CanvasScreenService {
	paddingRatio: number = BoardConstants.DEFAULT_PADDING_RATIO;
	hexagonArray: Array<{ x: number; y: number; radius: number; rotation: number; color: string }> = [];
	baseHexData: { x: number; y: number; r: number } = { x: 0, y: 0, r: 0 };
	currentHexPosition: { x: number; y: number } = { x: 0, y: 0 };

	constructor(private store: Store) {}

	createHexesData(centerX: number, centerY: number, hexRadius: number) {
		if (centerX < 0 || centerY < 0 || hexRadius <= 0) {
			throw new Error('Invalid input parameters for createHexesData');
		}

		this.hexagonArray = [];
		this.baseHexData = { x: centerX, y: centerY, r: hexRadius };

		this.createInnerHex();
		const innerHex = this.hexagonArray.length - 1;

		this.createMiddleHex();
		const middleHex = this.hexagonArray.length - innerHex - 7;

		this.createOuterHex();
		const outerHex = this.hexagonArray.length - innerHex - middleHex - 13;

		const filterOfConstantHexes = this.hexagonArray.filter(
			(hexagon) => hexagon.color !== HexColor.Basic && hexagon.color !== HexColor.Border && hexagon.color !== HexColor.Dev
		);
		console.log({
			Empty: this.hexagonArray.length - filterOfConstantHexes.length,
			Inner: innerHex,
			Middle: middleHex,
			Outer: outerHex,
			Pre: filterOfConstantHexes.length,
			Total: this.hexagonArray.length,
		});

		this.store.dispatch(updateStore({ key: 'boardHexagons', value: this.hexagonArray }));
	}

	private calcCurrentPosition(sideIndex: number, ringIndex: number, orientation: BoardHexOrientation, subHex: Boolean): { x: number; y: number } {
		const angle = (sideIndex * BoardConstants.PI2) / 6 + (subHex === true ? BoardConstants.PI2 / 3 : 0);
		const distance = this.baseHexData.r * 2 * ringIndex * this.paddingRatio;
		const [sin, cos] = [Math.sin(angle) * distance, Math.cos(angle) * distance];
		const { x, y } = subHex === true ? this.currentHexPosition : this.baseHexData;
		const [currentX, currentY] = orientation === BoardHexOrientation.Flat ? [x + cos, y + sin] : [x + sin, y + cos];

		if (subHex === false) {
			this.currentHexPosition = { x: currentX, y: currentY };
		}

		return { x: currentX, y: currentY };
	}

	private addHexagonData(HexagonData: BoardHexDataInterface) {
		this.hexagonArray.push(HexagonData);
	}

	private createSingleHexagonData(x: number, y: number, ringIndex: number, isSubHex: boolean, hexType: BoardHexType): BoardHexDataInterface {
		return HexagonDataFactory.createSingleHexagonData(x, y, this.baseHexData.r, ringIndex, isSubHex, hexType);
	}

	private createInnerHex() {
		this.addHexagonData(this.createSingleHexagonData(this.baseHexData.x, this.baseHexData.y, 0, false, BoardHexType.InnerHex));
		const innerHexEnd = BoardConstants.INNER_RING_RADIUS;

		for (let ringIndex = 1; ringIndex <= innerHexEnd; ringIndex++) {
			this.createInnerMainHexes(ringIndex, innerHexEnd);
		}
	}

	private createInnerMainHexes(ringIndex: number, innerHexEnd: number) {
		const limitInnerHex = ringIndex < innerHexEnd;
		const blocker = ringIndex !== 2;

		for (let sideIndex = 0; sideIndex < 6; sideIndex++) {
			const { x, y } = this.calcCurrentPosition(sideIndex, ringIndex, BoardHexOrientation.Flat, false);

			if (limitInnerHex && blocker) {
				this.addHexagonData(this.createSingleHexagonData(x, y, ringIndex, false, BoardHexType.InnerHex));
			}

			this.createInnerSubHexes(ringIndex, sideIndex, innerHexEnd);
		}
	}

	private createInnerSubHexes(ringIndex: number, sideIndex: number, innerHexEnd: number) {
		for (let subHexIndex = 1; subHexIndex < ringIndex; subHexIndex++) {
			const { x, y } = this.calcCurrentPosition(sideIndex, subHexIndex, BoardHexOrientation.Flat, true);
			const limitInnerSubHexes = ringIndex < innerHexEnd - 1 || (ringIndex == innerHexEnd - 1 && subHexIndex == ringIndex / 2);

			if (limitInnerSubHexes) {
				this.addHexagonData(this.createSingleHexagonData(x, y, ringIndex, true, BoardHexType.InnerHex));
			}
		}
	}

	private createMiddleHex() {
		this.paddingRatio = BoardConstants.MIDDLE_HEX_PADDING_RATIO_INITIAL;

		const middleHexStart = BoardConstants.INNER_RING_RADIUS - 1;
		const middleHexEnd = BoardConstants.MIDDLE_RING_RADIUS;

		for (let ringIndex = middleHexStart; ringIndex <= middleHexEnd; ringIndex++) {
			this.createMiddleMainHexes(ringIndex, middleHexStart, middleHexEnd);
		}
	}

	private createMiddleMainHexes(ringIndex: number, middleHexStart: number, middleHexEnd: number) {
		const isBlockerLevelCase = ringIndex != BoardConstants.INNER_RING_RADIUS;

		for (let sideIndex = 0; sideIndex < 6; sideIndex++) {
			if (ringIndex == middleHexEnd) this.paddingRatio = BoardConstants.MIDDLE_HEX_PADDING_RATIO_BLOCKER;
			const { x, y } = this.calcCurrentPosition(sideIndex, ringIndex, BoardHexOrientation.Angular, false);

			if (isBlockerLevelCase) {
				this.addHexagonData(this.createSingleHexagonData(x, y, ringIndex, false, BoardHexType.MiddleHex));
			}

			this.createMiddleSubHexes(ringIndex, sideIndex, middleHexStart, isBlockerLevelCase);
		}
		if (ringIndex > middleHexStart) this.paddingRatio = BoardConstants.MIDDLE_PADDING_RATIO_RESET;
	}

	private createMiddleSubHexes(ringIndex: number, sideIndex: number, middleHexStart: number, isBlockerLevelCase: boolean) {
		for (let subHexIndex = 1; subHexIndex < ringIndex; subHexIndex++) {
			const { x, y } = this.calcCurrentPosition(sideIndex, subHexIndex, BoardHexOrientation.Angular, true);

			const isPreMiddleRingSpecialCase = ringIndex > middleHexStart || (ringIndex == middleHexStart && (subHexIndex == 1 || subHexIndex == ringIndex - 1));
			const skipSubHexesAroundBlockersIfFalse =
				(isBlockerLevelCase == false && subHexIndex !== 1 && subHexIndex !== ringIndex - 1) || isBlockerLevelCase === true;
			if (isPreMiddleRingSpecialCase && skipSubHexesAroundBlockersIfFalse) {
				this.addHexagonData(this.createSingleHexagonData(x, y, ringIndex, true, BoardHexType.MiddleHex));
			}
		}
	}

	private createOuterHex() {
		const outerHexStart = BoardConstants.MIDDLE_RING_RADIUS + 1;
		const outerHexEnd = BoardConstants.MIDDLE_RING_RADIUS + 2;

		for (let ringIndex = outerHexStart; ringIndex <= outerHexEnd; ringIndex++) {
			this.createOuterMainHexes(ringIndex, outerHexStart, outerHexEnd);
		}
	}

	private createOuterMainHexes(ringIndex: number, outerHexStart: number, outerHexEnd: number) {
		this.paddingRatio = BoardConstants.OUTER_HEX_PADDING_RATIO;

		if (ringIndex >= outerHexStart) {
			for (let sideIndex = 0; sideIndex < 6; sideIndex++) {
				this.calcCurrentPosition(sideIndex, ringIndex, BoardHexOrientation.Angular, false);

				for (let subHexIndex = 1; subHexIndex < ringIndex; subHexIndex++) {
					if (ringIndex == outerHexStart || (ringIndex == outerHexEnd && subHexIndex % 3 == 0)) {
						const { x, y } = this.calcCurrentPosition(sideIndex, subHexIndex, BoardHexOrientation.Angular, true);
						this.addHexagonData(this.createSingleHexagonData(x, y, ringIndex, true, BoardHexType.OuterHex));
					}
				}
			}
		}

		if (ringIndex == outerHexStart) {
			this.createStarters(ringIndex);
		}
	}

	private createStarters(ringIndex: number) {
		this.paddingRatio = BoardConstants.OUTER_HEX_PADDING_RATIO_FOR_STARTERS;

		for (let sideIndex = 0; sideIndex < 6; sideIndex++) {
			const { x, y } = this.calcCurrentPosition(sideIndex, ringIndex, BoardHexOrientation.Flat, false);
			this.addHexagonData(this.createSingleHexagonData(x, y, ringIndex, false, BoardHexType.OuterHex));
		}
	}
}
