import { Injectable } from '@angular/core';
import { HexagonAdjectants } from '../models/classes/hexagon-adjectants.class';
import { BoardHexDataInterface } from '../models/interfaces/board-hex-data.interface';
import { AngleAndOrientationUtils } from '../utils/angle-and-orientation.utils';
import { PointDistancesUtils } from '../utils/points-distances.utils';

@Injectable({
	providedIn: 'root',
})
export class SpecialAdjectantsService {
	static findAdjectantsForSpecialCases(hexagonAdjectants: HexagonAdjectants, hexagonArray: Array<BoardHexDataInterface[]>, currentAngle: number) {
		if (
			((hexagonAdjectants._ringLevel >= 3 && hexagonAdjectants._ringLevel <= 5) || hexagonAdjectants._ringLevel === 11) &&
			hexagonAdjectants._adjectants[currentAngle].adjectantTo.length === 0 &&
			hexagonAdjectants._adjectants[currentAngle].bridgeTo.length === 0
		) {
			let foundAdjectant: BoardHexDataInterface | undefined;
			let counterPartAdjectant: BoardHexDataInterface | undefined;
			let adjectantsArrayForLevel5: Array<{ angle: number; adjectant: Array<BoardHexDataInterface> }> = [];
			let currentCoordinates = hexagonAdjectants._adjectants[currentAngle].direction;
			let orthogonalAngle = (currentAngle + 90) % 360;
			switch (hexagonAdjectants._ringLevel) {
				case 3:
					foundAdjectant = hexagonAdjectants.findCurrentPossibleHexagon(hexagonArray[5], currentAngle, [1, 3], 20);
					break;
				case 4:
					foundAdjectant = hexagonArray[5].find((hex, i, array) => {
						const nextHex = array[i + 1] ?? array.find((hex) => hex.id > 42);
						return (
							AngleAndOrientationUtils.arePointsOnSameLine(currentCoordinates, hex, orthogonalAngle, 30) &&
							AngleAndOrientationUtils.arePointsOnSameLine(nextHex, hex, orthogonalAngle, 30) &&
							PointDistancesUtils.getDistanceBetweenPoints(currentCoordinates, hex) <=
								PointDistancesUtils.getMaxDistanceToHexagon(hex, hexagonAdjectants._hexData, 1) +
									PointDistancesUtils.getMaxDistanceToHexagon(nextHex, hexagonAdjectants._hexData, 1)
						);
					});
					counterPartAdjectant = hexagonArray[5].find((hex) => {
						if (foundAdjectant === undefined) return false;
						return hex.id == foundAdjectant.id + 1;
					});
					break;
				case 5:
					let counterAngle = (currentAngle + 180) % 360;
					let level5FoundAdjectant: BoardHexDataInterface | undefined;
					let level5FoundCounterAdjectant: BoardHexDataInterface | undefined;
					if (hexagonAdjectants._id < 42) {
						if (hexagonAdjectants._adjectants[counterAngle].adjectantTo.length == 1) {
							level5FoundAdjectant = hexagonArray[6].find((hex, i, array) => {
								const nextHex = array[i + 1] ?? array.find((hex) => hex.id > 42);
								return (
									AngleAndOrientationUtils.arePointsOnSameLine(currentCoordinates, hex, orthogonalAngle, 30) &&
									AngleAndOrientationUtils.arePointsOnSameLine(nextHex, hex, orthogonalAngle, 30) &&
									PointDistancesUtils.getDistanceBetweenPoints(currentCoordinates, hex) <=
										PointDistancesUtils.getMaxDistanceToHexagon(hex, hexagonAdjectants._hexData, 1) +
											PointDistancesUtils.getMaxDistanceToHexagon(nextHex, hexagonAdjectants._hexData, 1)
								);
							});
							level5FoundCounterAdjectant = hexagonArray[6].find((hex) => {
								if (level5FoundAdjectant === undefined) return false;
								return hex.id == level5FoundAdjectant.id + 1;
							});
							if (level5FoundAdjectant !== undefined && level5FoundCounterAdjectant !== undefined) {
								adjectantsArrayForLevel5.push({ angle: currentAngle, adjectant: [level5FoundAdjectant, level5FoundCounterAdjectant] });
							}
							for (let otherAngle of [(currentAngle + 60) % 360, (currentAngle + 300) % 360]) {
								currentCoordinates = hexagonAdjectants._adjectants[otherAngle].direction;
								orthogonalAngle = (otherAngle + 90) % 360;
								level5FoundAdjectant = hexagonArray[5].find((hex, i, array) => {
									const nextHex = array[i + 1] ?? array.find((hex) => hex.id > 42);
									return (
										(AngleAndOrientationUtils.arePointsOnSameLine(currentCoordinates, hex, orthogonalAngle, 60) ||
											AngleAndOrientationUtils.arePointsOnSameLine(hex, currentCoordinates, orthogonalAngle, 60)) &&
										AngleAndOrientationUtils.arePointsOnSameLine(nextHex, hex, orthogonalAngle, 60) &&
										PointDistancesUtils.getDistanceBetweenPoints(currentCoordinates, hex) <=
											PointDistancesUtils.getMaxDistanceToHexagon(hex, hexagonAdjectants._hexData, 1) +
												PointDistancesUtils.getMaxDistanceToHexagon(nextHex, hexagonAdjectants._hexData, 1)
									);
								});
								level5FoundCounterAdjectant = hexagonArray[6].find((hex) => {
									if (level5FoundAdjectant === undefined) return false;
									const case1 =
										AngleAndOrientationUtils.arePointsOnSameLine(currentCoordinates, hex, orthogonalAngle, 60) &&
										AngleAndOrientationUtils.arePointsOnSameLine(level5FoundAdjectant, hex, orthogonalAngle, 60);
									const case2 =
										AngleAndOrientationUtils.arePointsOnSameLine(hex, currentCoordinates, orthogonalAngle, 60) &&
										AngleAndOrientationUtils.arePointsOnSameLine(hex, level5FoundAdjectant, orthogonalAngle, 60);
									return (
										(case1 || case2) &&
										PointDistancesUtils.getDistanceBetweenPoints(currentCoordinates, hex) <=
											PointDistancesUtils.getMaxDistanceToHexagon(hex, hexagonAdjectants._hexData, 1) +
												PointDistancesUtils.getMaxDistanceToHexagon(level5FoundAdjectant, hexagonAdjectants._hexData, 1)
									);
								});
								if (level5FoundAdjectant !== undefined && level5FoundCounterAdjectant !== undefined) {
									adjectantsArrayForLevel5.push({ angle: currentAngle, adjectant: [level5FoundAdjectant, level5FoundCounterAdjectant] });
								}
							}
						}
						for (let specialAdjectants of adjectantsArrayForLevel5) {
							specialAdjectants.adjectant.forEach((adjectant) => {
								hexagonAdjectants.pushAdjectant('adjectant', specialAdjectants.angle, adjectant);
							});
						}
					} else {
						if (hexagonAdjectants._adjectants[counterAngle].bridgeTo.length == 1) {
							level5FoundAdjectant = hexagonArray[3].find((hex, i, array) => {
								const nextHex = array[i + 1] ?? array[0];
								return (
									AngleAndOrientationUtils.arePointsOnSameLine(currentCoordinates, hex, orthogonalAngle, 30) &&
									AngleAndOrientationUtils.arePointsOnSameLine(nextHex, hex, orthogonalAngle, 30) &&
									PointDistancesUtils.getDistanceBetweenPoints(currentCoordinates, hex) <=
										PointDistancesUtils.getMaxDistanceToHexagon(hex, hexagonAdjectants._hexData, 1) +
											PointDistancesUtils.getMaxDistanceToHexagon(nextHex, hexagonAdjectants._hexData, 1)
								);
							});
							level5FoundCounterAdjectant = hexagonArray[3].find((hex) => {
								if (level5FoundAdjectant === undefined) return false;
								return hex.id == level5FoundAdjectant.id + 1;
							});
							if (level5FoundAdjectant !== undefined && level5FoundCounterAdjectant !== undefined) {
								hexagonAdjectants.pushAdjectant('adjectant', currentAngle, level5FoundAdjectant);
								hexagonAdjectants.pushAdjectant('adjectant', currentAngle, level5FoundCounterAdjectant);
							}
						}
					}
					break;
				case 11:
					if (Object.values(hexagonAdjectants._adjectants).reduce((totalLength, adjectant) => totalLength + adjectant.adjectantTo.length, 0) === 1) {
						const foundAngle = Object.entries(hexagonAdjectants._adjectants).find((adjectantPair) => adjectantPair[1].adjectantTo.length === 1);
						if (foundAngle !== undefined) {
							let level11FoundAdjectant: BoardHexDataInterface | undefined;
							let level11FoundCounterAdjectant: BoardHexDataInterface | undefined;
							const currentAngle = parseInt(foundAngle[0]);
							for (let otherAngle of [(currentAngle + 60) % 360, (currentAngle + 300) % 360]) {
								currentCoordinates = hexagonAdjectants._adjectants[otherAngle].direction;
								orthogonalAngle = (otherAngle + 90) % 360;
								level11FoundAdjectant = hexagonArray[9].find((hex, i, array) => {
									const nextHex = array[i + 1] ?? array[0];
									const case1 = AngleAndOrientationUtils.arePointsOnSameLine(currentCoordinates, hex, orthogonalAngle, 30);
									const case2 = AngleAndOrientationUtils.arePointsOnSameLine(hex, currentCoordinates, orthogonalAngle, 30);
									return (
										(case1 || case2) &&
										PointDistancesUtils.getDistanceBetweenPoints(currentCoordinates, hex) <=
											PointDistancesUtils.getMaxDistanceToHexagon(hex, hexagonAdjectants._hexData, 1) +
												PointDistancesUtils.getMaxDistanceToHexagon(nextHex, hexagonAdjectants._hexData, 1)
									);
								});
								level11FoundCounterAdjectant = hexagonArray[10].find((hex) => {
									if (level11FoundAdjectant === undefined) return false;
									const case1 =
										AngleAndOrientationUtils.arePointsOnSameLine(currentCoordinates, hex, orthogonalAngle, 30) &&
										AngleAndOrientationUtils.arePointsOnSameLine(level11FoundAdjectant, hex, orthogonalAngle, 30);
									const case2 =
										AngleAndOrientationUtils.arePointsOnSameLine(hex, currentCoordinates, orthogonalAngle, 30) &&
										AngleAndOrientationUtils.arePointsOnSameLine(hex, level11FoundAdjectant, orthogonalAngle, 30);
									return (
										(case1 || case2) &&
										PointDistancesUtils.getDistanceBetweenPoints(currentCoordinates, hex) <=
											PointDistancesUtils.getMaxDistanceToHexagon(hex, hexagonAdjectants._hexData, 1) +
												PointDistancesUtils.getMaxDistanceToHexagon(level11FoundAdjectant, hexagonAdjectants._hexData, 1)
									);
								});
								if (level11FoundAdjectant !== undefined && level11FoundCounterAdjectant !== undefined) {
									hexagonAdjectants.pushAdjectant('adjectant', currentAngle, level11FoundAdjectant);
									hexagonAdjectants.pushAdjectant('adjectant', currentAngle, level11FoundCounterAdjectant);
								}
							}
						}
					}
					break;
			}
			if (foundAdjectant !== undefined) hexagonAdjectants.pushAdjectant('adjectant', currentAngle, foundAdjectant);
			if (counterPartAdjectant !== undefined) hexagonAdjectants.pushAdjectant('adjectant', currentAngle, counterPartAdjectant);
		}
	}
}
