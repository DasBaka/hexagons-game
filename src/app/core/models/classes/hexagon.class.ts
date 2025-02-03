import Konva from 'konva';

interface HexagonProps {
	x: number;
	y: number;
	radius: number;
	rotation: number;
	color: string;
	name: string;
}

export class Hexagon extends Konva.RegularPolygon {
	constructor({ x, y, radius, rotation, color, name }: HexagonProps) {
		super();
		this.x(x);
		this.y(y);
		this.sides(6);
		this.radius(radius);
		this.stroke(color == 'brown' || color == 'blue' ? color : 'black');
		this.strokeWidth(2);
		this.fill(color == 'gray' || color == 'green' || color == 'lightgreen' ? color : 'transparent');
		this.rotation(rotation);
		this.id(name);
	}

	recolor(color: string) {
		this.fill(color);
	}
}
