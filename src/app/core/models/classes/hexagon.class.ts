import { IHexagonInstance } from '../interfaces/hexagon-instance-type.interface';
import Konva from 'konva';

/** Defines the properties required to create a Hexagon instance. */
interface IHexagonProps {
  x: number;
  y: number;
  radius: number;
  rotation: number;
  name: string;
  instanceType: IHexagonInstance;
}

/** Represents a hexagonal shape extending Konva.RegularPolygon with additional properties and methods for game board rendering. */
export class Hexagon extends Konva.RegularPolygon {
  public instanceType: IHexagonInstance;
  constructor({ x, y, radius, rotation, instanceType, name }: IHexagonProps) {
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

  /** Sets the base color of the hexagon based on its instance type. */
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

  /** Changes the fill color of the hexagon to the specified color. */
  public recolor(color: string) {
    this.fill(color);
  }
}
