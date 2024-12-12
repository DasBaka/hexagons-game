import Konva from 'konva';

export class Hexagon extends Konva.RegularPolygon {
	constructor(x: number, y: number, radius: number, rotation: number = 0, color: string) {
		super();
		this.x(x);
		this.y(y);
		this.sides(6);
		this.radius(radius);
		this.stroke(color == 'brown' ? color : 'black');
		this.strokeWidth(2);
		this.fill(color == 'gray' || color == 'green' || color == 'lightgreen' ? color : 'white');
		this.rotation(rotation);
	}

	recolor(color: string) {
		this.fill(color);
	}
}
