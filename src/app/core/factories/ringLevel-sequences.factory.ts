import { HexagonAdjectants } from '../models/classes/hexagon-adjectants.class';
import { IDirectionalHexData } from '../models/interfaces/board-hex-adjectants.interface';

/** Factory class responsible for generating and processing sequences of hexagons within ring levels, including adjacency and bridge relationships between hexagons. */
export class RingLevelSequencesFactory {
  /** Processes the given hexagon adjacents, generating sequences of adjacent and bridged hexagons, and updates the current hexagon with this information. */
  public static getHexSequences(hexagonAdjectants: HexagonAdjectants) {
    const currentHex = hexagonAdjectants._currentRing.find((hex) => hex.id === hexagonAdjectants._id);
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

  /** Helper method to trim adjectants and bridge information to a single string, suitable for storing in the sequence attribute of a hexagon. */
  private static trimmingAdjectants(
    adjectant: IDirectionalHexData,
    adjectantsByName: string[],
    bridgesByName: string[]
  ): string {
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
    if (adjectant.bridgeTo.length > 0) {
      bridgesByName.push(adjectant.bridgeTo[0].ringLevel + '|' + adjectant.bridgeTo[0].id);
    }
    return adjectantsString;
  }
}
