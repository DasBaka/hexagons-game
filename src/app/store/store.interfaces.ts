import { IBoardHexData } from '../core/models/interfaces/board-hex-data.interface';

/** Represents the structure of the application's state, containing a 2D array of board hexagons and a numeric counter. */
export interface IState {
  boardHexagons: IBoardHexData[][];
  counter: number;
}

/** Defines and exports the initial state object conforming to the IState interface, setting default values for the application's store. */
export const initialState: IState = {
  boardHexagons: [],
  counter: 0
};
