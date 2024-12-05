import Konva from 'konva';

export class Hexagon extends Konva.RegularPolygon {
	constructor(x: number, y: number, radius: number) {
		super();
		this.x(x);
		this.y(y);
		this.sides(6);
		this.radius(radius);
		this.stroke('black');
		this.strokeWidth(2);
		this.fill('red');
	}
}
