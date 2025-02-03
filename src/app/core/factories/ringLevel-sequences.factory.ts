import { HexagonAdjectants } from '../models/classes/hexagon-adjectants.class';
import { DirectionalHexData } from '../models/interfaces/board-hex-adjectants.interface';
import { BoardHexDataInterface } from '../models/interfaces/board-hex-data.interface';

export class RingLevelSequencesFactory {
	static getHexSequences(hexagonAdjectants: HexagonAdjectants) {
		let currentHex = hexagonAdjectants._currentRing.find((hex) => hex.id === hexagonAdjectants._id);
		if (currentHex !== undefined) {
			const adjectantsByName: string[] = [];
			const bridgesByName: string[] = [];
			const trimmedAdjectants = Object.values(hexagonAdjectants._adjectants).map((adjectant) =>
				this.trimmingAdjectants(adjectant, adjectantsByName, bridgesByName)
			);
			currentHex.sequence = trimmedAdjectants;
			currentHex.adjectantsByName = adjectantsByName;
			currentHex.bridgesByName = bridgesByName;
		}
	}

	static trimmingAdjectants(adjectant: DirectionalHexData, adjectantsByName: string[], bridgesByName: string[]): string {
		let adjectantsString = adjectant.adjectantTo.length > 0 ? '' : 'none';

		for (let adjectantsIndex = 0; adjectantsIndex < adjectant.adjectantTo.length; adjectantsIndex++) {
			const ringLevel = adjectant.adjectantTo[adjectantsIndex].ringLevel;
			const id = adjectant.adjectantTo[adjectantsIndex].id;
			adjectantsString += ringLevel;
			adjectantsByName.push(ringLevel + '|' + id);
			if (adjectantsIndex < adjectant.adjectantTo.length - 1) {
				adjectantsString += 'x';
			}
		}
		adjectantsString += '|' + (adjectant.bridgeTo.length > 0 ? adjectant.bridgeTo[0].ringLevel : 'none');
		adjectant.bridgeTo.length > 0 ? bridgesByName.push(adjectant.bridgeTo[0].ringLevel + '|' + adjectant.bridgeTo[0].id) : '';
		return adjectantsString;
	}
}
