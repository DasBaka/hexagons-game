export interface Adjectant {
	[angle: number]: DirectionalHexData;
}

export interface DirectionalHexData {
	direction: {
		x: number;
		y: number;
	};
	adjectantTo: Array<HexConnection>;
	bridgeTo: Array<HexConnection>;
}

export interface HexConnection {
	ringLevel: number;
	id: number;
}
