import { AfterViewInit, Component } from '@angular/core';
import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';

@Component({
	selector: 'app-canvas-screen',
	imports: [],
	templateUrl: './canvas-screen.component.html',
	styleUrl: './canvas-screen.component.scss',
})
export class CanvasScreenComponent implements AfterViewInit {
	stage!: Stage;
	layer!: Layer;

	constructor() {}

	ngAfterViewInit() {
		this.stage = new Konva.Stage({
			container: 'screen',
			width: 500,
			height: 500,
		});
		this.layer = new Konva.Layer();

		var circle = new Konva.Circle({
			x: this.stage.width() / 2,
			y: this.stage.height() / 2,
			radius: 70,
			fill: 'red',
			stroke: 'black',
			strokeWidth: 4,
		});

		// add the shape to the layer
		this.layer.add(circle);

		// add the this.layer to the this.stage
		this.stage.add(this.layer);

		// draw the image
		this.layer.draw();
		console.log(this.layer, this.stage);
	}
}
