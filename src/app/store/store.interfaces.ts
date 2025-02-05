import { BoardHexDataInterface } from '../core/models/interfaces/board-hex-data.interface';

export interface State {
  boardHexagons: BoardHexDataInterface[][];
  counter: number;
}

export const initialState: State = {
  boardHexagons: [],
  counter: 0
};
