export interface State {
	boardHexagons: Array<{ x: number; y: number; radius: number; rotation: number; color: string }>;
	counter: number;
}

export const initialState: State = {
	boardHexagons: [],
	counter: 0,
};
