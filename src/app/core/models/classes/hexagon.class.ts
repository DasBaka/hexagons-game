import Konva from 'konva';
import { HexagonInstanceType } from '../interfaces/hexagon-instance-type.interface';

interface HexagonProps {
  x: number;
  y: number;
  radius: number;
  rotation: number;
  name: string;
  instanceType: HexagonInstanceType;
}

export class Hexagon extends Konva.RegularPolygon {
  public instanceType: HexagonInstanceType;
  constructor({ x, y, radius, rotation, instanceType, name }: HexagonProps) {
    super();
    this.instanceType = instanceType;
    this.stroke('black');
    if (instanceType.border) this.stroke('brown');
    this.setBaseColor();
    this.x(x);
    this.y(y);
    this.sides(6);
    this.radius(radius);
    this.strokeWidth(2);
    this.rotation(rotation);
    this.id(name);
  }

  public setBaseColor() {
    switch (this.instanceType.main) {
      case 'tar':
        if (this.instanceType.sub === 'start') this.fill('gray');
        else this.fill('lightgray');
        break;
      case 'player':
        if (this.instanceType.sub === 'start') this.fill('green');
        else if (this.instanceType.sub === 'tree') this.fill('lightgreen');
        else this.fill('aquamarine');
        break;
      default:
        this.fill('transparent');
    }
  }

  public recolor(color: string) {
    this.fill(color);
  }
}
